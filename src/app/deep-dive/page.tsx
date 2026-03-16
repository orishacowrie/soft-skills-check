"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult, DeepDiveQuestion, DeepDiveAnswer } from "@/types/assessment";
import { dimensionMap } from "@/lib/questions";
import { scaleLabels } from "@/lib/questions";
import ProgressBar from "@/components/ProgressBar";

export default function DeepDivePage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [questions, setQuestions] = useState<DeepDiveQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<DeepDiveAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    if (!stored) {
      router.push("/test");
      return;
    }

    const result: AnalysisResult = JSON.parse(stored);
    setAnalysis(result);

    if (result.weakDimensions.length === 0) {
      router.push("/recommendations");
      return;
    }

    // Generate deep-dive questions
    fetch("/api/generate-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weakDimensions: result.weakDimensions,
        dimensionScores: result.dimensionScores,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка генерации вопросов");
        return res.json();
      })
      .then((data: { questions: DeepDiveQuestion[] }) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const handleAnswer = useCallback(
    (value: number) => {
      if (!questions[currentIndex]) return;

      const newAnswers = [...answers];
      const q = questions[currentIndex];
      const existingIndex = newAnswers.findIndex((a) => a.questionId === q.id);

      const answer: DeepDiveAnswer = {
        questionId: q.id,
        value,
        dimension: q.dimension,
      };

      if (existingIndex >= 0) {
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers.push(answer);
      }

      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsAnimating(false);
        }, 300);
      } else {
        // Save and go to recommendations
        sessionStorage.setItem("deepDiveAnswers", JSON.stringify(newAnswers));
        router.push("/recommendations");
      }
    },
    [answers, currentIndex, questions, router]
  );

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 animate-pulse-slow">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            AI генерирует вопросы
          </h2>
          <p className="text-slate-400 text-sm">
            Формируем углублённый тест на основе ваших слабых зон...
          </p>
          <div className="flex gap-1.5 mt-6">
            <div className="w-2 h-2 rounded-full bg-violet-500 loading-dot" />
            <div className="w-2 h-2 rounded-full bg-violet-500 loading-dot" />
            <div className="w-2 h-2 rounded-full bg-violet-500 loading-dot" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Ошибка</h2>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.push("/recommendations")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm"
          >
            Перейти к рекомендациям
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400">Нет вопросов для углублённой диагностики.</p>
        <button
          onClick={() => router.push("/recommendations")}
          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm"
        >
          Перейти к рекомендациям
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Углублённая диагностика
        </h1>
        <p className="text-slate-400 text-sm">
          Дополнительные вопросы, сфокусированные на ваших зонах роста
        </p>
      </div>

      <div className="mb-8">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <div
        className={`transition-all duration-300 ${
          isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-medium rounded-full mb-4">
              {dimensionMap[currentQuestion.dimension]?.name || currentQuestion.dimension}
            </span>
            <p className="text-lg md:text-xl text-slate-100 leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  existingAnswer?.value === value
                    ? "border-violet-500 bg-violet-500/10 text-violet-100"
                    : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    existingAnswer?.value === value
                      ? "bg-violet-500 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {value}
                </span>
                <span className="text-sm md:text-base">{scaleLabels[value]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            currentIndex === 0
              ? "text-slate-600 cursor-not-allowed"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад
        </button>
        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>
    </div>
  );
}
