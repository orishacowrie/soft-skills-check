import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6">
          Бесплатный AI-powered инструмент
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Оценка soft skills
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            вайб-кодера
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          30 вопросов о том, как ты работаешь с AI-инструментами. Честный
          AI-анализ твоих сильных и слабых сторон. Персональный план развития.
        </p>
        <Link
          href="/context"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105"
        >
          Начать оценку
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            step: "01",
            title: "Самооценка",
            description:
              "30 сценарных вопросов по 6 измерениям: критическое мышление, коммуникация, адаптивность, самоорганизация, продуктовое мышление, коллаборация.",
          },
          {
            step: "02",
            title: "AI-анализ",
            description:
              "Claude анализирует твои ответы, строит профиль и определяет зоны роста. Потом генерирует дополнительные вопросы для углублённой диагностики.",
          },
          {
            step: "03",
            title: "План развития",
            description:
              "Персональные рекомендации: конкретные шаги, привычки и ресурсы для прокачки слабых сторон.",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
              {item.step}
            </span>
            <h3 className="text-lg font-semibold text-slate-100 mt-3 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Dimensions preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          6 измерений оценки
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🔍",
              name: "Критическое мышление",
              desc: "Оценка AI-выхода, обнаружение галлюцинаций",
            },
            {
              icon: "💬",
              name: "Коммуникация",
              desc: "Промпт-инжиниринг, общение с командой",
            },
            {
              icon: "⚡",
              name: "Адаптивность",
              desc: "Освоение новых инструментов, гибкость",
            },
            {
              icon: "📋",
              name: "Самоорганизация",
              desc: "Планирование, дисциплина, контроль качества",
            },
            {
              icon: "🎯",
              name: "Продуктовое мышление",
              desc: "UX-чутьё, понимание пользователя",
            },
            {
              icon: "🤝",
              name: "Коллаборация",
              desc: "Командная работа, обратная связь",
            },
          ].map((dim) => (
            <div
              key={dim.name}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50"
            >
              <span className="text-xl mt-0.5">{dim.icon}</span>
              <div>
                <div className="font-medium text-slate-200 text-sm">
                  {dim.name}
                </div>
                <div className="text-xs text-slate-500">{dim.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-slate-500 text-sm mb-4">
          Занимает 10-15 минут. Данные не сохраняются на сервере.
        </p>
        <Link
          href="/context"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors border border-slate-700"
        >
          Пройти тест
        </Link>
      </div>
    </div>
  );
}
