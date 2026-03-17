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
  team_inperson: { ru: "С командой/коллегами — вживую", en: "With team/colleagues — in person" },
  team_online: { ru: "С командой/коллегами — онлайн/видео", en: "With team/colleagues — online/video call" },
  family_inperson: { ru: "С семьёй/друзьями — вживую", en: "With family/friends — in person" },
  family_online: { ru: "С семьёй/друзьями — по видео/онлайн", en: "With family/friends — video call/online" },
  // Legacy keys for backward compatibility
  team: { ru: "С командой/коллегами", en: "With team/colleagues" },
  family: { ru: "С семьёй/друзьями", en: "With family/friends" },
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
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

    const isWithOthers = context.includes("team") || context.includes("family");
    const isOnline = context.includes("online");

    const systemPrompt = isEn
      ? `You are a soft skills coach. Generate a practical homework assignment.

Structure your assignment in this order:
1. PREPARATION — what to do before starting (choose a topic/situation, warn participants if with others, set up environment)
2. CORE CHALLENGE — the main exercise to practice the skill
3. REFLECTION — how to evaluate what happened

Rules:
- Be extremely specific. Don't say "discuss a topic" — suggest 2-3 concrete topic options to choose from.
- If exercise involves other people, include a preparation step: "Tell them this is a practice exercise for developing [skill]. Ask if they're willing to participate for ~X minutes."
${isOnline ? '- The person will be doing this remotely via video call, not in person. Adapt accordingly.' : ''}
${isWithOthers ? '- Include preparation step for other participants.' : ''}
- Make it feel like a real challenge, not a lecture.

IMPORTANT: Respond ONLY with valid JSON. No markdown.`
      : `Ты — коуч по soft skills. Сгенерируй практическое домашнее задание.

Структура задания:
1. ПОДГОТОВКА — что сделать до начала (выбрать тему/ситуацию, предупредить участников если с кем-то, подготовить обстановку)
2. ОСНОВНОЙ ЧЕЛЛЕНДЖ — главное упражнение для практики навыка
3. РЕФЛЕКСИЯ — как оценить что получилось

Правила:
- Будь максимально конкретным. Не "обсудите тему" — предложи 2-3 конкретных варианта темы на выбор.
- Если упражнение с другими людьми, включи шаг подготовки: "Предупредите их, что это тренировочное упражнение для развития [навык]. Спросите, готовы ли они уделить ~X минут."
${isOnline ? '- Человек будет делать это удалённо по видеосвязи, не вживую. Учти это.' : ''}
${isWithOthers ? '- Включи шаг подготовки для других участников.' : ''}
- Задание должно ощущаться как настоящий вызов, а не лекция.

ВАЖНО: Отвечай ТОЛЬКО валидным JSON. Без markdown.`;

    const userMessage = isEn
      ? `Generate a homework assignment:

Dimensions:
${dimContext}

Time: ${timeLabel}
Context: ${ctxLabel}

JSON format:
{
  "title": "Short engaging title",
  "description": "What this develops and why (2-3 sentences)",
  "preparation": ["Prep step 1", "Prep step 2"],
  "steps": ["Step 1: specific action", "Step 2: specific action"],
  "reflection": ["Question to ask yourself after"],
  "expectedOutcome": "What you'll learn",
  "timeEstimate": "~time",
  "topicSuggestions": ["Concrete topic option 1", "Option 2", "Option 3"]
}

"preparation" = what to do BEFORE the exercise (choose topic, warn participants, set up).
"topicSuggestions" = 2-3 specific topics/situations to choose from for the exercise.
"reflection" = 1-2 questions to ask yourself after completing the exercise.`
      : `Сгенерируй домашнее задание:

Измерения:
${dimContext}

Время: ${timeLabel}
Контекст: ${ctxLabel}

Формат JSON:
{
  "title": "Короткое вовлекающее название",
  "description": "Что развивает и почему (2-3 предложения)",
  "preparation": ["Шаг подготовки 1", "Шаг подготовки 2"],
  "steps": ["Шаг 1: конкретное действие", "Шаг 2: конкретное действие"],
  "reflection": ["Вопрос для рефлексии после выполнения"],
  "expectedOutcome": "Что узнаешь / чему научишься",
  "timeEstimate": "~время",
  "topicSuggestions": ["Конкретная тема/ситуация 1", "Вариант 2", "Вариант 3"]
}

"preparation" = что сделать ДО упражнения (выбрать тему, предупредить участников, подготовить обстановку).
"topicSuggestions" = 2-3 конкретных варианта темы/ситуации для упражнения на выбор.
"reflection" = 1-2 вопроса для самоанализа после выполнения.`;

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
