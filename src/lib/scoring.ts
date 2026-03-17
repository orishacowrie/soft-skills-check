import { Answer, DimensionScore, DimensionKey, AnalysisResult } from "@/types/assessment";
import { questions, dimensionMap } from "./questions";

/**
 * Calculate score for a single answer, handling reverse-scored questions.
 * Reverse questions: agreement (5) means low skill, so we flip the scale.
 */
function getAdjustedScore(questionId: string, value: number): number {
  const question = questions.find((q) => q.id === questionId);
  if (!question) return value;
  return question.reverse ? 6 - value : value;
}

/**
 * Calculate dimension scores from raw answers.
 * Dynamically builds dimensions from the actual answered questions.
 */
export function calculateDimensionScores(
  answers: Answer[]
): DimensionScore[] {
  const dimensionAnswers: Record<string, number[]> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const adjustedScore = getAdjustedScore(answer.questionId, answer.value);
    if (!dimensionAnswers[question.dimension]) {
      dimensionAnswers[question.dimension] = [];
    }
    dimensionAnswers[question.dimension].push(adjustedScore);
  }

  const scores: DimensionScore[] = [];

  for (const [key, values] of Object.entries(dimensionAnswers)) {
    const dimKey = key as DimensionKey;
    if (values.length === 0) continue;

    const dimInfo = dimensionMap[dimKey];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const percentage = ((avg - 1) / 4) * 100;

    scores.push({
      dimension: dimKey,
      name: dimInfo ? dimInfo.name : dimKey,
      score: Math.round(avg * 10) / 10,
      percentage: Math.round(percentage),
    });
  }

  return scores;
}

/**
 * Get the overall average score.
 */
export function calculateOverallScore(dimensionScores: DimensionScore[]): number {
  if (dimensionScores.length === 0) return 0;
  const avg =
    dimensionScores.reduce((sum, d) => sum + d.score, 0) /
    dimensionScores.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Identify the weakest dimensions (bottom 2-3).
 */
export function getWeakDimensions(
  dimensionScores: DimensionScore[],
  count: number = 3
): DimensionKey[] {
  return [...dimensionScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .filter((d) => d.score < 4)
    .map((d) => d.dimension);
}

/**
 * Identify the strongest dimensions.
 */
export function getStrongDimensions(
  dimensionScores: DimensionScore[],
  count: number = 2
): DimensionKey[] {
  return [...dimensionScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .filter((d) => d.score >= 3)
    .map((d) => d.dimension);
}

/**
 * Generate a template-based analysis result (no AI call needed).
 * Works for express and deep tests. Free, instant, deterministic.
 */
export function generateTemplateAnalysis(
  answers: Answer[],
  lang: "ru" | "en" = "ru"
): AnalysisResult {
  const dimensionScores = calculateDimensionScores(answers);
  const overallScore = calculateOverallScore(dimensionScores);
  const weakDimensions = getWeakDimensions(dimensionScores);
  const strongDimensions = getStrongDimensions(dimensionScores);

  const isRu = lang === "ru";

  // Template-based strengths
  const strengths = strongDimensions.map((d) => {
    const info = dimensionMap[d];
    const name = info ? (isRu ? info.name : info.nameEn) : d;
    const score = dimensionScores.find((s) => s.dimension === d)?.score ?? 0;
    if (score >= 4.5) return isRu ? `Отличный уровень: ${name}` : `Excellent: ${name}`;
    if (score >= 4) return isRu ? `Сильная сторона: ${name}` : `Strength: ${name}`;
    return isRu ? `Хороший уровень: ${name}` : `Good level: ${name}`;
  });

  // Template-based weaknesses
  const weaknesses = weakDimensions.map((d) => {
    const info = dimensionMap[d];
    const name = info ? (isRu ? info.name : info.nameEn) : d;
    const score = dimensionScores.find((s) => s.dimension === d)?.score ?? 0;
    if (score < 2.5) return isRu ? `Требует внимания: ${name}` : `Needs attention: ${name}`;
    if (score < 3.5) return isRu ? `Есть потенциал: ${name}` : `Has potential: ${name}`;
    return isRu ? `Можно усилить: ${name}` : `Room to grow: ${name}`;
  });

  // Template summary
  let summary: string;
  if (overallScore >= 4.5) {
    summary = isRu
      ? "Высокий общий уровень. Сфокусируйся на точечном усилении отдельных аспектов."
      : "High overall level. Focus on targeted improvement in specific areas.";
  } else if (overallScore >= 3.5) {
    summary = isRu
      ? "Хорошая база. Есть конкретные направления для роста — квиз и домашка помогут их прокачать."
      : "Good foundation. There are specific growth areas — the quiz and homework will help develop them.";
  } else if (overallScore >= 2.5) {
    summary = isRu
      ? "Средний уровень с заметными зонами роста. Рекомендуем пройти глубокий тест и квиз для проработки."
      : "Average level with notable growth areas. We recommend the deep test and quiz for improvement.";
  } else {
    summary = isRu
      ? "Много пространства для роста — и это отлично, значит каждое упражнение даст заметный результат."
      : "Lots of room for growth — and that's great, it means every exercise will show noticeable results.";
  }

  return {
    dimensionScores,
    overallScore,
    strengths,
    weaknesses,
    summary,
    weakDimensions,
  };
}
