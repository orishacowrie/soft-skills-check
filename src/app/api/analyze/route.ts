import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { calculateDimensionScores, calculateOverallScore, getWeakDimensions, getStrongDimensions } from "@/lib/scoring";
import { dimensionMap, questions } from "@/lib/questions";
import { Answer, AnalysisResult } from "@/types/assessment";


export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { answers, resume, jobDescription } = (await request.json()) as {
      answers: Answer[];
      resume?: string;
      jobDescription?: string;
    };

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: "No answers provided" },
        { status: 400 }
      );
    }

    const dimensionScores = calculateDimensionScores(answers);
    const overallScore = calculateOverallScore(dimensionScores);
    const weakDimensions = getWeakDimensions(dimensionScores);
    const strongDimensions = getStrongDimensions(dimensionScores);

    // Build context for AI
    const scoresContext = dimensionScores
      .map(
        (d) =>
          `- ${d.name}: ${d.score}/5 (${d.percentage}%)`
      )
      .join("\n");

    const answersContext = answers
      .map((a) => {
        const q = questions.find((q) => q.id === a.questionId);
        return q
          ? `[${a.questionId}] "${q.text}" → ${a.value}/5${q.reverse ? " (reverse)" : ""}`
          : null;
      })
      .filter(Boolean)
      .join("\n");

    let personalizationContext = "";
    if (resume) {
      personalizationContext += `\n\nРезюме кандидата (используй для персонализации анализа):\n${resume.slice(0, 3000)}`;
    }
    if (jobDescription) {
      personalizationContext += `\n\nОписание целевой вакансии/роли:\n${jobDescription.slice(0, 2000)}`;
    }

    const systemPrompt = `Ты — эксперт по soft skills для разработчиков, работающих с AI-инструментами (вайб-кодеров).
Тебе даны результаты теста самооценки по 6 измерениям. Каждое измерение оценивается по шкале 1-5.
Reverse-вопросы уже пересчитаны — высокий балл везде означает высокий навык.

Твоя задача — дать честный, конструктивный анализ. Не льсти, но и не демотивируй.
Будь конкретным: упоминай конкретные паттерны поведения из ответов.
${resume ? "\nЕсли предоставлено резюме — учитывай опыт и навыки кандидата при анализе." : ""}
${jobDescription ? "\nЕсли предоставлено описание вакансии — соотноси результаты с требованиями роли." : ""}

ВАЖНО: Отвечай ТОЛЬКО валидным JSON без markdown-форматирования. Никаких \`\`\`json блоков.`;

    const userMessage = `Результаты теста:

Баллы по измерениям:
${scoresContext}

Общий балл: ${overallScore}/5

Детальные ответы:
${answersContext}${personalizationContext}

Сформируй анализ в формате JSON:
{
  "summary": "Общее описание профиля (2-3 предложения, на русском)",
  "strengths": ["сильная сторона 1", "сильная сторона 2", "сильная сторона 3"],
  "weaknesses": ["зона роста 1", "зона роста 2", "зона роста 3"]
}

Сильные стороны и зоны роста должны быть конкретными, привязанными к ответам, а не общими фразами.`;

    let response: string;
    try {
      response = await callClaude(systemPrompt, userMessage);
    } catch (apiError) {
      console.error("Claude API error:", apiError);
      return NextResponse.json(
        { error: "AI-анализ не удался. Попробуйте ещё раз." },
        { status: 500 }
      );
    }

    let aiAnalysis: { summary: string; strengths: string[]; weaknesses: string[] };
    try {
      aiAnalysis = JSON.parse(response);
    } catch {
      // If AI returns non-JSON, use defaults
      aiAnalysis = {
        summary: "Анализ завершён. Ваш профиль показывает интересное сочетание развитых навыков и зон для роста.",
        strengths: strongDimensions.map(
          (d) => `Высокий уровень: ${dimensionMap[d].name}`
        ),
        weaknesses: weakDimensions.map(
          (d) => `Зона роста: ${dimensionMap[d].name}`
        ),
      };
    }

    const result: AnalysisResult = {
      dimensionScores,
      overallScore,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      summary: aiAnalysis.summary,
      weakDimensions,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze results" },
      { status: 500 }
    );
  }
}
