import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { dimensionMap } from "@/lib/questions";
import { AnalysisResult, DeepDiveAnswer, RecommendationResult } from "@/types/assessment";


export async function POST(request: NextRequest) {
  try {
    const { analysis, deepDiveAnswers, resume, jobDescription } = (await request.json()) as {
      analysis: AnalysisResult;
      deepDiveAnswers: DeepDiveAnswer[];
      resume?: string;
      jobDescription?: string;
    };

    if (!analysis) {
      return NextResponse.json(
        { error: "No analysis data provided" },
        { status: 400 }
      );
    }

    const scoresContext = analysis.dimensionScores
      .map((d) => `- ${d.name} (${d.dimension}): ${d.score}/5`)
      .join("\n");

    const strengthsContext =
      analysis.strengths.length > 0
        ? `Сильные стороны: ${analysis.strengths.join("; ")}`
        : "";

    const weaknessesContext =
      analysis.weaknesses.length > 0
        ? `Зоны роста: ${analysis.weaknesses.join("; ")}`
        : "";

    const deepDiveContext =
      deepDiveAnswers.length > 0
        ? `\nОтветы на углублённый тест:\n${deepDiveAnswers
            .map(
              (a) =>
                `[${a.questionId}] Измерение: ${dimensionMap[a.dimension]?.name || a.dimension}, Балл: ${a.value}/5`
            )
            .join("\n")}`
        : "\nУглублённый тест не пройден.";

    let personalizationContext = "";
    if (resume) {
      personalizationContext += `\n\nРезюме кандидата (учитывай его опыт и навыки при формировании рекомендаций):\n${resume.slice(0, 3000)}`;
    }
    if (jobDescription) {
      personalizationContext += `\n\nОписание целевой вакансии/роли (привяжи рекомендации к требованиям этой роли):\n${jobDescription.slice(0, 2000)}`;
    }

    const dimensionsToRecommend = analysis.dimensionScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 4)
      .map((d) => d.dimension);

    const systemPrompt = `Ты — карьерный коуч и эксперт по развитию soft skills для вайб-кодеров.
На основе результатов тестирования, сформируй персональный план развития.

Правила:
- Язык: русский
- Рекомендации должны быть конкретными и actionable
- Фокус на практических шагах, которые можно начать делать сегодня
- Учитывай контекст работы с AI-инструментами
- Для ресурсов: рекомендуй конкретные подходы и практики, а не ссылки
- Будь честным, но мотивирующим
${resume ? "- Если предоставлено резюме — учитывай текущий опыт и навыки кандидата, предлагай рекомендации исходя из его уровня" : ""}
${jobDescription ? "- Если предоставлено описание вакансии — привяжи рекомендации к требованиям этой конкретной роли" : ""}

ВАЖНО: Отвечай ТОЛЬКО валидным JSON без markdown-форматирования. Никаких \`\`\`json блоков.`;

    const userMessage = `Профиль пользователя:

Баллы по измерениям:
${scoresContext}

Общий балл: ${analysis.overallScore}/5
${strengthsContext}
${weaknessesContext}
${deepDiveContext}${personalizationContext}

Сгенерируй рекомендации для измерений: ${dimensionsToRecommend.map((d) => dimensionMap[d]?.name || d).join(", ")}

Формат JSON:
{
  "summary": "Краткое ободряющее вступление (1-2 предложения)",
  "recommendations": [
    {
      "dimension": "dimension_key",
      "dimensionName": "Название измерения",
      "score": 3.2,
      "title": "Короткий заголовок рекомендации",
      "description": "Описание проблемы и почему это важно (2-3 предложения)",
      "actions": [
        "Конкретный шаг 1",
        "Конкретный шаг 2",
        "Конкретный шаг 3"
      ],
      "resources": [
        "Практика или подход 1",
        "Практика или подход 2"
      ]
    }
  ],
  "dailyHabits": [
    "Привычка 1, которую можно внедрить сегодня",
    "Привычка 2",
    "Привычка 3"
  ],
  "weeklyGoals": [
    "Цель на эту неделю 1",
    "Цель на эту неделю 2",
    "Цель на эту неделю 3"
  ]
}

Измерения для рекомендаций (dimension ключи): ${dimensionsToRecommend.join(", ")}
Используй score из результатов теста для каждого измерения.`;

    const response = await callClaude(systemPrompt, userMessage);

    let result: RecommendationResult;
    try {
      result = JSON.parse(response);
    } catch {
      // Fallback
      result = {
        summary:
          "На основе вашего профиля мы подготовили рекомендации. Даже небольшие изменения в привычках могут значительно улучшить ваши soft skills.",
        recommendations: dimensionsToRecommend.map((dim) => {
          const score = analysis.dimensionScores.find(
            (d) => d.dimension === dim
          );
          return {
            dimension: dim,
            dimensionName: dimensionMap[dim]?.name || dim,
            score: score?.score || 0,
            title: `Развитие: ${dimensionMap[dim]?.name || dim}`,
            description: `Текущий балл ${score?.score || 0}/5. Есть потенциал для роста в этом направлении.`,
            actions: [
              "Уделяйте этому измерению осознанное внимание в повседневной работе",
              "Практикуйте целенаправленно каждый день",
            ],
            resources: [],
          };
        }),
        dailyHabits: [
          "Перед каждым промптом формулируйте ожидаемый результат",
          "Ревьюьте AI-код перед коммитом",
          "Делитесь одним полезным приёмом с командой",
        ],
        weeklyGoals: [
          "Попробуйте один новый AI-инструмент или подход",
          "Напишите документацию к одному AI-решению",
        ],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
