import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6">
          Бесплатный open-source тренажёр
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Тренажёр
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            soft skills
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Пойми, как ты работаешь с AI и в команде. Получи честный анализ
          и персональный план роста — с конкретными шагами.
        </p>
        <Link
          href="/context"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105"
        >
          Начать тренировку
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
            title: "Разминка",
            description:
              "30 ситуаций из реальной работы. Отвечаешь честно — без правильных и неправильных ответов. Это не экзамен, а зеркало.",
          },
          {
            step: "02",
            title: "AI-разбор",
            description:
              "Claude строит твой профиль, находит точки роста и генерирует дополнительные вопросы — чтобы копнуть глубже именно там, где есть потенциал.",
          },
          {
            step: "03",
            title: "План роста",
            description:
              "Не абстрактные советы, а конкретные шаги: что делать каждый день, какие привычки формировать, на что обратить внимание.",
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
          6 направлений роста
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🔍",
              name: "Критическое мышление",
              desc: "Умение проверять, сомневаться, видеть ошибки",
            },
            {
              icon: "💬",
              name: "Коммуникация",
              desc: "Чёткость в постановке задач и общении с людьми",
            },
            {
              icon: "⚡",
              name: "Адаптивность",
              desc: "Скорость обучения, гибкость, работа с неизвестным",
            },
            {
              icon: "📋",
              name: "Самоорганизация",
              desc: "Планирование, дисциплина, контроль качества",
            },
            {
              icon: "🎯",
              name: "Продуктовое мышление",
              desc: "Фокус на пользователе и результате",
            },
            {
              icon: "🤝",
              name: "Коллаборация",
              desc: "Командная работа, обратная связь, открытость",
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
          10-15 минут. Данные остаются только у тебя.
        </p>
        <Link
          href="/context"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors border border-slate-700"
        >
          Начать
        </Link>
      </div>
    </div>
  );
}
