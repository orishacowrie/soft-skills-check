import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { dimensionMap } from "@/lib/questions";
import { DimensionKey, DimensionScore, DeepDiveQuestion } from "@/types/assessment";


export async function POST(request: NextRequest) {
  try {
    const { weakDimensions, dimensionScores, resume, jobDescription } = (await request.json()) as {
      weakDimensions: DimensionKey[];
      dimensionScores: DimensionScore[];
      resume?: string;
      jobDescription?: string;
    };

    if (!weakDimensions || weakDimensions.length === 0) {
      return NextResponse.json(
        { error: "No weak dimensions provided" },
        { status: 400 }
      );
    }

    const dimensionContext = weakDimensions
      .map((d) => {
        const score = dimensionScores.find((s) => s.dimension === d);
        const info = dimensionMap[d];
        return `- ${info.name} (${d}): ${score?.score || "?"}/5 — ${info.description}`;
      })
      .join("\n");

    const questionsPerDimension = Math.max(
      3,
      Math.min(5, Math.floor(12 / weakDimensions.length))
    );
    const totalQuestions = questionsPerDimension * weakDimensions.length;

    let personalizationContext = "";
    if (resume) {
      personalizationContext += `\n\nРезюме кандидата (учитывай его опыт при формулировке вопросов):\n${resume.slice(0, 3000)}`;
    }
    if (jobDescription) {
      personalizationContext += `\n\nОписание целевой вакансии/роли (адаптируй вопросы под требования роли):\n${jobDescription.slice(0, 2000)}`;
    }

    const systemPrompt = `Ты — эксперт по оценке soft skills для вайб-кодеров (разработчиков, активно использующих AI).
Тебе нужно создать углублённые вопросы для диагностики слабых зон.

Правила:
- Вопросы должны быть сценарными — описывать конкретную рабочую ситуацию
- Язык: русский, неформальный но профессиональный (на "ты")
- Вопросы должны быть более специфичными и проникающими, чем базовый тест
- Каждый вопрос — это утверждение, которое оценивается по шкале 1-5 (от "совсем не про меня" до "точно про меня")
- Высокий балл (5) должен означать ВЫСОКИЙ уровень навыка (НЕ делай reverse-вопросы)
- Вопросы должны раскрывать разные аспекты каждого измерения
${resume ? "- Если предоставлено резюме — используй контекст опыта кандидата для создания более релевантных сценариев" : ""}
${jobDescription ? "- Если предоставлено описание вакансии — адаптируй сценарии под требования роли" : ""}

ВАЖНО: Отвечай ТОЛЬКО валидным JSON без markdown-форматирования. Никаких \`\`\`json блоков.`;

    const userMessage = `Слабые измерения пользователя:
${dimensionContext}${personalizationContext}

Сгенерируй ${totalQuestions} вопросов (по ${questionsPerDimension} на каждое измерение).

Формат JSON:
{
  "questions": [
    {
      "id": "dd_1",
      "dimension": "dimension_key",
      "text": "Текст вопроса-утверждения"
    }
  ]
}

Нумерация id: dd_1, dd_2, dd_3 и т.д.
dimension должен быть одним из: ${weakDimensions.join(", ")}`;

    const response = await callClaude(systemPrompt, userMessage);

    let parsed: { questions: DeepDiveQuestion[] };
    try {
      parsed = JSON.parse(response);
    } catch {
      // Fallback: generate basic questions
      const fallbackQuestions: DeepDiveQuestion[] = weakDimensions.flatMap(
        (dim, dimIdx) =>
          Array.from({ length: questionsPerDimension }, (_, i) => ({
            id: `dd_${dimIdx * questionsPerDimension + i + 1}`,
            dimension: dim,
            text: `Оцените свой уровень в области "${dimensionMap[dim].name}" по аспекту ${i + 1}`,
          }))
      );
      parsed = { questions: fallbackQuestions };
    }

    // Validate and sanitize
    const validQuestions = parsed.questions
      .filter(
        (q) =>
          q.id &&
          q.dimension &&
          q.text &&
          weakDimensions.includes(q.dimension as DimensionKey)
      )
      .slice(0, 15);

    return NextResponse.json({ questions: validQuestions });
  } catch (error) {
    console.error("Generate test error:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}
