"use client";

import { useState, useEffect } from "react";

export type QuestionRating = "clear" | "trivial" | "okay" | "ambiguous";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  dimensionName: string;
  onAnswer: (value: number) => void;
  onRate?: (rating: QuestionRating) => void;
  initialValue?: number;
  initialRating?: QuestionRating;
  scaleLabelsMap: Record<number, string>;
}

const RATING_OPTIONS: { key: QuestionRating; emoji: string; label: string; labelEn: string }[] = [
  { key: "clear", emoji: "👍", label: "Понятно", labelEn: "Clear" },
  { key: "trivial", emoji: "🥱", label: "Банально", labelEn: "Trivial" },
  { key: "okay", emoji: "😐", label: "Так себе", labelEn: "So-so" },
  { key: "ambiguous", emoji: "❓", label: "Непонятно", labelEn: "Ambiguous" },
];

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  dimensionName,
  onAnswer,
  onRate,
  initialValue,
  initialRating,
  scaleLabelsMap,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(initialValue ?? null);
  const [rating, setRating] = useState<QuestionRating | null>(initialRating ?? null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setSelected(initialValue ?? null);
    setRating(initialRating ?? null);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [questionNumber, initialValue, initialRating]);

  const handleRate = (r: QuestionRating) => {
    setRating(r);
    onRate?.(r);
  };

  const handleSelect = (value: number) => {
    setSelected(value);
    // Small delay for visual feedback before advancing
    setTimeout(() => onAnswer(value), 300);
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isAnimating
          ? "opacity-0 translate-y-4"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-medium rounded-full mb-4">
            {dimensionName}
          </span>
          <p className="text-lg md:text-xl text-slate-100 leading-relaxed">
            {questionText}
          </p>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                selected === value
                  ? "border-violet-500 bg-violet-500/10 text-violet-100"
                  : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  selected === value
                    ? "bg-violet-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {value}
              </span>
              <span className="text-sm md:text-base">{scaleLabelsMap[value]}</span>
            </button>
          ))}
        </div>

        {/* Question quality rating */}
        <div className="mt-5 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-600 mr-1">Вопрос:</span>
            {RATING_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={(e) => { e.stopPropagation(); handleRate(opt.key); }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-all duration-150 border ${
                  rating === opt.key
                    ? opt.key === "clear"
                      ? "border-green-500/40 bg-green-500/10 text-green-400"
                      : opt.key === "trivial"
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                      : opt.key === "okay"
                        ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                        : "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-500"
                }`}
              >
                <span className="text-xs">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
