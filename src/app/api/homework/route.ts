import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { dimensionMap } from "@/lib/questions";
import { DimensionKey } from "@/types/assessment";

interface HomeworkRequest {
  dimensions: string[];
  timeFormat: string;
  context: string;
  selfAssessmentScores: Record<string, number>;
  quizScores: Record<string, number>;
  lang: string;
}

interface HomeworkResponse {
  title: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  timeEstimate: string;
}

const timeFormatLabels: Record<string, { ru: string; en: string }> = {
  "15min": { ru: "15 минут", en: "15 minutes" },
  "1hour": { ru: "1 час", en: "1 hour" },
  "1day": { ru: "1 день", en: "1 day" },
  "1week": { ru: "1 неделя", en: "1 week" },
};

const contextLabels: Record<string, { ru: string; en: string }> = {
  alone_offline: { ru: "Один, без интернета (в дороге, на природе)", en: "Alone, no internet (traveling, outdoors)" },
  alone_computer: { ru: "Один, с компьютером", en: "Alone, with a computer" },
  team: { ru: "С командой/коллегами", en: "With team/colleagues" },
  family: { ru: "С семьёй/друзьями", en: "With family/friends" },
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body: HomeworkRequest = await request.json();
    const { dimensions, timeFormat, context, selfAssessmentScores, quizScores, lang } = body;

    if (!dimensions || dimensions.length === 0) {
      return NextResponse.json(
        { error: "No dimensions provided" },
        { status: 400 }
      );
    }

    const isEn = lang === "en";

    // Build dimension context
    const dimContext = dimensions
      .map((d) => {
        const info = dimensionMap[d as DimensionKey];
        const name = isEn ? info?.nameEn || d : info?.name || d;
        const selfScore = selfAssessmentScores?.[d];
        const quizScore = quizScores?.[d];
        let line = `- ${name}`;
        if (selfScore !== undefined) line += ` (${isEn ? "self-assessment" : "самооценка"}: ${selfScore}/5)`;
        if (quizScore !== undefined) line += ` (${isEn ? "quiz" : "квиз"}: ${quizScore}%)`;
        return line;
      })
      .join("\n");

    const timeLabelObj = timeFormatLabels[timeFormat] || timeFormatLabels["1hour"];
    const timeLabel = isEn ? timeLabelObj.en : timeLabelObj.ru;
    const ctxLabelObj = contextLabels[context] || contextLabels["alone_computer"];
    const ctxLabel = isEn ? ctxLabelObj.en : ctxLabelObj.ru;

    const systemPrompt = isEn
      ? `You are a soft skills coach specializing in AI-era professional development.
Your task is to generate a practical homework assignment for developing specific soft skills.

The assignment must be:
- Specific and actionable (not vague advice)
- Feasible within the given time and context
- Directly tied to the weak dimensions
- Creative and engaging

IMPORTANT: Respond ONLY with valid JSON. No markdown formatting.`
      : `Ты — коуч по soft skills, специализирующийся на профессиональном развитии в эпоху AI.
Твоя задача — сгенерировать практическое домашнее задание для развития конкретных soft skills.

Задание должно быть:
- Конкретным и выполнимым (не абстрактные советы)
- Реализуемым в заданных временных рамках и контексте
- Напрямую связанным со слабыми измерениями
- Креативным и вовлекающим

ВАЖНО: Отвечай ТОЛЬКО валидным JSON. Никакого markdown-форматирования.`;

    const userMessage = isEn
      ? `Generate a homework assignment with these parameters:

Dimensions to develop:
${dimContext}

Time format: ${timeLabel}
Context: ${ctxLabel}

Generate JSON:
{
  "title": "Assignment title (short, engaging)",
  "description": "What this assignment will help develop and why (2-3 sentences)",
  "steps": ["Step 1: specific action", "Step 2: specific action", "..."],
  "expectedOutcome": "What the person will learn or achieve",
  "timeEstimate": "~estimated time"
}

Make it practical, specific, and tied to the given dimensions. The steps should be clear enough that someone could follow them without additional instructions.`
      : `Сгенерируй домашнее задание с этими параметрами:

Измерения для развития:
${dimContext}

Формат времени: ${timeLabel}
Контекст: ${ctxLabel}

Сгенерируй JSON:
{
  "title": "Название задания (короткое, вовлекающее)",
  "description": "Что это задание поможет развить и почему (2-3 предложения)",
  "steps": ["Шаг 1: конкретное действие", "Шаг 2: конкретное действие", "..."],
  "expectedOutcome": "Что человек узнает или чему научится",
  "timeEstimate": "~примерное время"
}

Сделай задание практичным, конкретным и привязанным к заданным измерениям. Шаги должны быть достаточно ясными, чтобы их можно было выполнить без дополнительных инструкций.`;

    let response: string;
    try {
      response = await callClaude(systemPrompt, userMessage);
    } catch (apiError) {
      console.error("Claude API error:", apiError);
      return NextResponse.json(
        { error: isEn ? "AI generation failed. Please try again." : "Ошибка AI-генерации. Попробуйте ещё раз." },
        { status: 500 }
      );
    }

    let homework: HomeworkResponse;
    try {
      homework = JSON.parse(response);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          homework = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            { error: isEn ? "Failed to parse AI response" : "Не удалось разобрать ответ AI" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: isEn ? "Failed to parse AI response" : "Не удалось разобрать ответ AI" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Homework generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate homework" },
      { status: 500 }
    );
  }
}
