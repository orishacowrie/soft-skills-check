export interface QuizQuestion {
  id: string;
  dimension: string;
  text: string;
  textEn: string;
  options: { key: string; text: string; textEn: string }[];
  correctAnswer: string;
  explanation: string;
  explanationEn: string;
  source: string;
  sourceUrl: string;
}

// Import the full 200-question pool (20 per topic, quality-filtered)
import { quizPool } from "./quiz-pool";

// Use the full curated pool (200 questions, 20 per topic)
export const quizQuestions: QuizQuestion[] = quizPool;

// Legacy inline questions kept as fallback
const _legacyQuestions: QuizQuestion[] = [
  // ─── Critical Thinking (3 questions) ───
  {
    id: "quiz_ct_01",
    dimension: "critical_thinking",
    text: "Какой из этих признаков чаще всего указывает на «галлюцинацию» AI при генерации кода?",
    textEn: "Which of these signs most often indicates an AI 'hallucination' when generating code?",
    options: [
      { key: "a", text: "Код использует устаревший синтаксис", textEn: "The code uses outdated syntax" },
      { key: "b", text: "Код ссылается на несуществующие методы библиотеки или API-эндпоинты", textEn: "The code references non-existent library methods or API endpoints" },
      { key: "c", text: "Код содержит слишком много комментариев", textEn: "The code contains too many comments" },
      { key: "d", text: "Код написан в функциональном стиле вместо ООП", textEn: "The code is written in functional style instead of OOP" },
    ],
    correctAnswer: "b",
    explanation: "Галлюцинации AI — это когда модель уверенно генерирует несуществующие сущности: методы, API, пакеты. Это главный признак, потому что AI создаёт правдоподобно выглядящий код, который не работает. Устаревший синтаксис или стиль кода — это вопросы качества, а не галлюцинаций.",
    explanationEn: "AI hallucinations occur when the model confidently generates non-existent entities: methods, APIs, packages. This is the key sign because AI creates plausible-looking code that doesn't work. Outdated syntax or code style are quality issues, not hallucinations.",
    source: "OpenAI Research — Language Model Hallucinations",
    sourceUrl: "https://openai.com/research",
  },
  {
    id: "quiz_ct_02",
    dimension: "critical_thinking",
    text: "Согласно концепции «сопротивления автоматизации» (automation bias), люди склонны...",
    textEn: "According to the concept of 'automation bias', people tend to...",
    options: [
      { key: "a", text: "Отвергать любые предложения автоматизированных систем", textEn: "Reject any suggestions from automated systems" },
      { key: "b", text: "Чрезмерно доверять автоматизированным системам и игнорировать противоречащую информацию", textEn: "Over-trust automated systems and ignore contradicting information" },
      { key: "c", text: "Использовать автоматизацию только для рутинных задач", textEn: "Use automation only for routine tasks" },
      { key: "d", text: "Перепроверять каждый результат автоматизированной системы", textEn: "Double-check every result of an automated system" },
    ],
    correctAnswer: "b",
    explanation: "Automation bias — это когнитивное искажение, при котором люди склонны чрезмерно доверять автоматизированным системам, включая AI. Они принимают их выход за истину, даже когда другие данные говорят об обратном. Это особенно опасно при работе с AI-генерацией кода.",
    explanationEn: "Automation bias is a cognitive bias where people tend to over-trust automated systems, including AI. They accept output as truth even when other data contradicts it. This is especially dangerous when working with AI-generated code.",
    source: "Parasuraman & Manzey — Complacency and Bias in Human Use of Automation",
    sourceUrl: "https://doi.org/10.1518/001872010X12584729881591",
  },
  {
    id: "quiz_ct_03",
    dimension: "critical_thinking",
    text: "Какой подход наиболее эффективен для верификации AI-сгенерированного кода?",
    textEn: "What approach is most effective for verifying AI-generated code?",
    options: [
      { key: "a", text: "Запустить код — если работает, значит корректен", textEn: "Run the code — if it works, it's correct" },
      { key: "b", text: "Попросить другую AI-модель проверить код", textEn: "Ask another AI model to check the code" },
      { key: "c", text: "Прочитать код, понять логику, проверить edge cases и сверить с документацией", textEn: "Read the code, understand the logic, check edge cases and verify against documentation" },
      { key: "d", text: "Переписать весь код вручную", textEn: "Rewrite all code manually" },
    ],
    correctAnswer: "c",
    explanation: "Единственный надёжный способ — понять, что делает код. «Работает» не значит «корректен» — код может работать на happy path, но ломаться на edge cases. Другая AI может повторить те же ошибки. А переписывать всё вручную — неэффективно.",
    explanationEn: "The only reliable approach is understanding what the code does. 'Works' doesn't mean 'correct' — code can work on the happy path but break on edge cases. Another AI might repeat the same errors. Rewriting everything manually is inefficient.",
    source: "Soft Skills Guide: Critical Thinking",
    sourceUrl: "/guide/critical-thinking",
  },

  // ─── Communication (3 questions) ───
  {
    id: "quiz_cm_01",
    dimension: "communication",
    text: "В структуре эффективного промпта, какой элемент больше всего влияет на качество результата?",
    textEn: "In the structure of an effective prompt, which element most affects the quality of the result?",
    options: [
      { key: "a", text: "Длина промпта — чем длиннее, тем лучше", textEn: "Prompt length — the longer, the better" },
      { key: "b", text: "Чёткое описание ожидаемого формата и контекста задачи", textEn: "Clear description of expected format and task context" },
      { key: "c", text: "Использование вежливых формулировок", textEn: "Using polite phrasing" },
      { key: "d", text: "Указание конкретной модели AI в промпте", textEn: "Specifying the specific AI model in the prompt" },
    ],
    correctAnswer: "b",
    explanation: "Ключ к эффективному промптингу — ясность контекста и ожиданий. Чёткое описание задачи, ограничений и формата результата даёт AI всё необходимое для точного ответа. Длина сама по себе не помогает, а вежливость и упоминание модели не влияют на качество.",
    explanationEn: "The key to effective prompting is clarity of context and expectations. A clear description of the task, constraints, and expected format gives AI everything needed for an accurate response. Length alone doesn't help, and politeness or model mentions don't affect quality.",
    source: "Anthropic — Prompt Engineering Guide",
    sourceUrl: "https://docs.anthropic.com/claude/docs/prompt-engineering",
  },
  {
    id: "quiz_cm_02",
    dimension: "communication",
    text: "Согласно модели Шеннона-Уивера, что является основной причиной недопонимания в коммуникации?",
    textEn: "According to the Shannon-Weaver model, what is the main cause of miscommunication?",
    options: [
      { key: "a", text: "Отсутствие обратной связи", textEn: "Lack of feedback" },
      { key: "b", text: "Шум в канале передачи информации", textEn: "Noise in the communication channel" },
      { key: "c", text: "Различия в образовании собеседников", textEn: "Differences in speakers' education" },
      { key: "d", text: "Использование технического жаргона", textEn: "Use of technical jargon" },
    ],
    correctAnswer: "b",
    explanation: "В модели Шеннона-Уивера «шум» — это любое искажение сигнала между отправителем и получателем. Это может быть буквальный шум, разный контекст, эмоциональное состояние, языковой барьер. При работе с AI «шум» — это неоднозначность промпта, отсутствие контекста, неявные допущения.",
    explanationEn: "In the Shannon-Weaver model, 'noise' is any signal distortion between sender and receiver. This can be literal noise, different contexts, emotional states, or language barriers. When working with AI, 'noise' is prompt ambiguity, missing context, and implicit assumptions.",
    source: "Shannon & Weaver — The Mathematical Theory of Communication",
    sourceUrl: "https://en.wikipedia.org/wiki/Shannon%E2%80%93Weaver_model",
  },
  {
    id: "quiz_cm_03",
    dimension: "communication",
    text: "Какой из этих приёмов промпт-инжиниринга называется «Chain of Thought»?",
    textEn: "Which of these prompt engineering techniques is called 'Chain of Thought'?",
    options: [
      { key: "a", text: "Просить AI генерировать несколько вариантов ответа", textEn: "Asking AI to generate multiple answer variants" },
      { key: "b", text: "Просить AI рассуждать пошагово перед финальным ответом", textEn: "Asking AI to reason step-by-step before the final answer" },
      { key: "c", text: "Давать AI примеры входа и выхода (few-shot)", textEn: "Giving AI input-output examples (few-shot)" },
      { key: "d", text: "Задавать уточняющие вопросы в серии промптов", textEn: "Asking clarifying questions in a series of prompts" },
    ],
    correctAnswer: "b",
    explanation: "Chain of Thought (CoT) — это техника, при которой AI просят показать ход рассуждений шаг за шагом. Это значительно улучшает качество ответов на сложные задачи, потому что модель «думает вслух», а не прыгает к ответу. Исследования показывают, что CoT особенно эффективен для математики и логики.",
    explanationEn: "Chain of Thought (CoT) asks AI to show its reasoning step by step. This significantly improves answer quality for complex tasks because the model 'thinks aloud' instead of jumping to conclusions. Research shows CoT is especially effective for math and logic.",
    source: "Wei et al. — Chain-of-Thought Prompting",
    sourceUrl: "https://arxiv.org/abs/2201.11903",
  },

  // ─── Adaptability (3 questions) ───
  {
    id: "quiz_ad_01",
    dimension: "adaptability",
    text: "Согласно модели Кюблер-Росс (адаптированной для изменений), какая стадия идёт сразу после «Шока/Отрицания»?",
    textEn: "According to the Kubler-Ross model (adapted for change), which stage comes right after 'Shock/Denial'?",
    options: [
      { key: "a", text: "Принятие", textEn: "Acceptance" },
      { key: "b", text: "Эксперименты", textEn: "Experimentation" },
      { key: "c", text: "Гнев/Сопротивление", textEn: "Anger/Resistance" },
      { key: "d", text: "Интеграция", textEn: "Integration" },
    ],
    correctAnswer: "c",
    explanation: "Кривая изменений Кюблер-Росс: Шок/Отрицание → Гнев/Сопротивление → Торг/Депрессия → Принятие → Интеграция. При внедрении AI-инструментов многие проходят через сопротивление: «зачем мне это?», «мой способ работает лучше». Это нормальная стадия, а не ошибка.",
    explanationEn: "The Kubler-Ross change curve: Shock/Denial → Anger/Resistance → Bargaining/Depression → Acceptance → Integration. When adopting AI tools, many go through resistance: 'why do I need this?', 'my way works better'. This is a normal stage, not a failure.",
    source: "Kubler-Ross — Change Curve",
    sourceUrl: "https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model",
  },
  {
    id: "quiz_ad_02",
    dimension: "adaptability",
    text: "Что такое «Growth Mindset» по Кэрол Дуэк?",
    textEn: "What is 'Growth Mindset' according to Carol Dweck?",
    options: [
      { key: "a", text: "Убеждение, что способности можно развивать через усилия и обучение", textEn: "The belief that abilities can be developed through effort and learning" },
      { key: "b", text: "Стремление к постоянному карьерному росту", textEn: "Striving for constant career growth" },
      { key: "c", text: "Позитивное мышление и визуализация успеха", textEn: "Positive thinking and success visualization" },
      { key: "d", text: "Фокус на количественных метриках и KPI", textEn: "Focus on quantitative metrics and KPIs" },
    ],
    correctAnswer: "a",
    explanation: "Growth Mindset — это убеждение, что интеллект и навыки не фиксированы, а развиваются через практику и обучение. Люди с growth mindset воспринимают ошибки как возможность для роста, а не как доказательство некомпетентности. В контексте AI — это готовность учиться новым инструментам.",
    explanationEn: "Growth Mindset is the belief that intelligence and skills are not fixed but develop through practice and learning. People with a growth mindset see mistakes as opportunities for growth, not proof of incompetence. In the AI context, it's the readiness to learn new tools.",
    source: "Carol Dweck — Mindset: The New Psychology of Success",
    sourceUrl: "https://en.wikipedia.org/wiki/Mindset#Fixed_and_growth_mindset",
  },
  {
    id: "quiz_ad_03",
    dimension: "adaptability",
    text: "При появлении нового AI-инструмента, какая стратегия обучения наиболее эффективна?",
    textEn: "When a new AI tool appears, which learning strategy is most effective?",
    options: [
      { key: "a", text: "Прочитать всю документацию от начала до конца перед использованием", textEn: "Read the entire documentation before using it" },
      { key: "b", text: "Подождать, пока инструмент станет стабильным и появятся best practices", textEn: "Wait until the tool becomes stable and best practices emerge" },
      { key: "c", text: "Начать с маленького реального проекта, осваивая по ходу", textEn: "Start with a small real project, learning as you go" },
      { key: "d", text: "Пройти полный онлайн-курс по этому инструменту", textEn: "Complete a full online course on this tool" },
    ],
    correctAnswer: "c",
    explanation: "Обучение через действие (learning by doing) — самый эффективный подход для быстро меняющихся инструментов. Документация устаревает, курсы появляются позже, а ожидание стабильности означает отставание. Маленький реальный проект даёт контекст и мотивацию для глубокого понимания.",
    explanationEn: "Learning by doing is the most effective approach for rapidly evolving tools. Documentation gets outdated, courses appear later, and waiting for stability means falling behind. A small real project provides context and motivation for deep understanding.",
    source: "Kolb — Experiential Learning Theory",
    sourceUrl: "https://en.wikipedia.org/wiki/Experiential_learning",
  },

  // ─── Self-Organization (3 questions) ───
  {
    id: "quiz_so_01",
    dimension: "self_organization",
    text: "Что такое «Правило двух минут» из методологии GTD Дэвида Аллена?",
    textEn: "What is the 'Two-Minute Rule' from David Allen's GTD methodology?",
    options: [
      { key: "a", text: "Планировать не более чем на 2 минуты вперёд", textEn: "Plan no more than 2 minutes ahead" },
      { key: "b", text: "Если задача занимает менее 2 минут — делай её сразу, не записывай", textEn: "If a task takes less than 2 minutes — do it immediately, don't write it down" },
      { key: "c", text: "Каждые 2 минуты делать перерыв", textEn: "Take a break every 2 minutes" },
      { key: "d", text: "Тратить 2 минуты на обзор задач каждый час", textEn: "Spend 2 minutes reviewing tasks every hour" },
    ],
    correctAnswer: "b",
    explanation: "Правило двух минут — ключевой принцип GTD: если задача занимает менее 2 минут, сделай её сразу. Записывание, приоритизация и планирование займут больше времени, чем само выполнение. В контексте AI — мелкие правки часто быстрее сделать руками, чем формулировать промпт.",
    explanationEn: "The Two-Minute Rule is a key GTD principle: if a task takes less than 2 minutes, do it immediately. Recording, prioritizing, and planning would take more time than doing it. In the AI context — small fixes are often faster to do manually than to formulate a prompt.",
    source: "David Allen — Getting Things Done",
    sourceUrl: "https://gettingthingsdone.com/",
  },
  {
    id: "quiz_so_02",
    dimension: "self_organization",
    text: "Какой принцип описывает «scope creep» в контексте AI-разработки?",
    textEn: "What principle describes 'scope creep' in the context of AI development?",
    options: [
      { key: "a", text: "Постепенное расширение проекта за пределы изначального плана из-за лёгкости генерации", textEn: "Gradual project expansion beyond the initial plan due to ease of generation" },
      { key: "b", text: "Увеличение времени ответа AI при длинных контекстах", textEn: "Increasing AI response time with long contexts" },
      { key: "c", text: "Снижение качества кода при частом использовании AI", textEn: "Declining code quality with frequent AI use" },
      { key: "d", text: "Рост затрат на API-вызовы", textEn: "Rising API call costs" },
    ],
    correctAnswer: "a",
    explanation: "Scope creep при работе с AI — особенно опасная ловушка. Когда AI легко генерирует фичи, появляется соблазн добавлять всё больше функционала: «а давай ещё вот это добавим, AI же легко сделает». В итоге проект разрастается, а фокус на MVP теряется.",
    explanationEn: "Scope creep with AI is an especially dangerous trap. When AI easily generates features, there's a temptation to keep adding: 'let's add this too, AI can do it easily'. The project grows while MVP focus is lost.",
    source: "PMI — Project Management Body of Knowledge",
    sourceUrl: "https://www.pmi.org/pmbok-guide-standards",
  },
  {
    id: "quiz_so_03",
    dimension: "self_organization",
    text: "Техника Pomodoro предполагает работу интервалами по...",
    textEn: "The Pomodoro Technique involves working in intervals of...",
    options: [
      { key: "a", text: "15 минут работы, 5 минут отдыха", textEn: "15 minutes work, 5 minutes rest" },
      { key: "b", text: "25 минут работы, 5 минут отдыха", textEn: "25 minutes work, 5 minutes rest" },
      { key: "c", text: "45 минут работы, 15 минут отдыха", textEn: "45 minutes work, 15 minutes rest" },
      { key: "d", text: "60 минут работы, 10 минут отдыха", textEn: "60 minutes work, 10 minutes rest" },
    ],
    correctAnswer: "b",
    explanation: "Классический Pomodoro: 25 минут фокусированной работы, потом 5 минут отдыха. После 4 помидоров — длинный перерыв (15-30 минут). Это помогает поддерживать концентрацию и избегать выгорания, особенно при итеративной работе с AI.",
    explanationEn: "Classic Pomodoro: 25 minutes of focused work, then 5 minutes rest. After 4 pomodoros — a long break (15-30 minutes). This helps maintain concentration and avoid burnout, especially during iterative AI work.",
    source: "Francesco Cirillo — The Pomodoro Technique",
    sourceUrl: "https://francescocirillo.com/products/the-pomodoro-technique",
  },

  // ─── Product Thinking (3 questions) ───
  {
    id: "quiz_pt_01",
    dimension: "product_thinking",
    text: "Что такое MVP (Minimum Viable Product)?",
    textEn: "What is MVP (Minimum Viable Product)?",
    options: [
      { key: "a", text: "Самый дешёвый вариант продукта", textEn: "The cheapest version of a product" },
      { key: "b", text: "Продукт с минимальным функционалом, достаточным для проверки гипотезы на реальных пользователях", textEn: "A product with minimum functionality sufficient to test a hypothesis with real users" },
      { key: "c", text: "Первая версия продукта без багов", textEn: "The first bug-free version of a product" },
      { key: "d", text: "Прототип без бэкенда", textEn: "A prototype without a backend" },
    ],
    correctAnswer: "b",
    explanation: "MVP — это не «плохой продукт», а стратегический минимум для проверки ключевой гипотезы. Идея Эрика Риса: вместо того чтобы строить полный продукт и надеяться, что он нужен — выпусти минимум и проверь на реальных пользователях. AI ускоряет создание MVP, но не заменяет необходимость думать, что проверять.",
    explanationEn: "MVP is not a 'bad product' but a strategic minimum for testing a key hypothesis. Eric Ries's idea: instead of building a complete product hoping it's needed — release the minimum and test with real users. AI accelerates MVP creation but doesn't replace the need to think about what to test.",
    source: "Eric Ries — The Lean Startup",
    sourceUrl: "https://theleanstartup.com/",
  },
  {
    id: "quiz_pt_02",
    dimension: "product_thinking",
    text: "Эвристика Якоба Нильсена «Видимость статуса системы» означает, что...",
    textEn: "Jakob Nielsen's heuristic 'Visibility of System Status' means that...",
    options: [
      { key: "a", text: "Все элементы интерфейса должны быть видны без прокрутки", textEn: "All UI elements should be visible without scrolling" },
      { key: "b", text: "Система должна постоянно информировать пользователя о том, что происходит", textEn: "The system should always keep the user informed about what is going on" },
      { key: "c", text: "Код должен быть открытым для аудита", textEn: "The code should be open for auditing" },
      { key: "d", text: "Логи должны быть доступны пользователю", textEn: "Logs should be accessible to the user" },
    ],
    correctAnswer: "b",
    explanation: "Первая из 10 эвристик Нильсена: система должна через обратную связь сообщать пользователю, что происходит, в разумные сроки. Прогресс-бары, спиннеры, сообщения об успехе/ошибке — всё это реализация этого принципа. AI-генерация часто забывает про loading states.",
    explanationEn: "The first of Nielsen's 10 heuristics: the system should provide appropriate feedback within reasonable time. Progress bars, spinners, success/error messages — all implement this principle. AI generation often forgets about loading states.",
    source: "Jakob Nielsen — 10 Usability Heuristics",
    sourceUrl: "https://www.nngroup.com/articles/ten-usability-heuristics/",
  },
  {
    id: "quiz_pt_03",
    dimension: "product_thinking",
    text: "Jobs To Be Done (JTBD) framework фокусируется на...",
    textEn: "The Jobs To Be Done (JTBD) framework focuses on...",
    options: [
      { key: "a", text: "Описании функционала продукта", textEn: "Describing product functionality" },
      { key: "b", text: "Задаче, которую пользователь пытается решить, «нанимая» продукт", textEn: "The job the user is trying to accomplish by 'hiring' a product" },
      { key: "c", text: "Сегментации пользователей по демографии", textEn: "Segmenting users by demographics" },
      { key: "d", text: "Анализе конкурентных продуктов", textEn: "Competitive product analysis" },
    ],
    correctAnswer: "b",
    explanation: "JTBD смотрит не на характеристики продукта и не на демографию пользователя, а на «работу», которую пользователь хочет выполнить. Клейтон Кристенсен: «Люди не покупают дрель — они покупают дырку в стене». Этот фреймворк помогает не переусложнять продукт, а решать реальную задачу.",
    explanationEn: "JTBD looks not at product features or user demographics, but at the 'job' the user wants to accomplish. Clayton Christensen: 'People don't buy a drill — they buy a hole in the wall.' This framework helps avoid overcomplicating the product and focus on solving the real problem.",
    source: "Clayton Christensen — Competing Against Luck",
    sourceUrl: "https://en.wikipedia.org/wiki/Jobs_to_be_done",
  },

  // ─── Collaboration (3 questions from quiz-batch-2.json) ───
  {
    id: "cl_q01",
    dimension: "collaboration",
    text: "Согласно Эми Эдмондсон, психологическая безопасность в команде означает, что...",
    textEn: "According to Amy Edmondson, psychological safety in a team means that...",
    options: [
      { key: "a", text: "Все участники всегда соглашаются друг с другом, чтобы избежать конфликтов", textEn: "All team members always agree with each other to avoid conflicts" },
      { key: "b", text: "Участники чувствуют себя в безопасности, рискуя и проявляя уязвимость, без страха наказания", textEn: "Team members feel safe to take risks and be vulnerable without fear of punishment" },
      { key: "c", text: "Руководитель защищает команду от внешнего давления и дедлайнов", textEn: "The manager protects the team from external pressure and deadlines" },
      { key: "d", text: "Никто в команде не получает негативную обратную связь", textEn: "Nobody on the team receives negative feedback" },
    ],
    correctAnswer: "b",
    explanation: "Психологическая безопасность по Эдмондсон — это убеждённость, что ты не будешь наказан или унижен за высказывание идей, вопросов, ошибок или сомнений. Это не про комфорт или отсутствие конфликтов, а про свободу быть собой в рабочем контексте.",
    explanationEn: "Edmondson's psychological safety is the belief that you won't be punished or humiliated for speaking up with ideas, questions, mistakes, or concerns. It's not about comfort or absence of conflict, but about freedom to be yourself in a work context.",
    source: "Amy Edmondson — The Fearless Organization",
    sourceUrl: "https://fearlessorganization.com/",
  },
  {
    id: "cl_q02",
    dimension: "collaboration",
    text: "В модели Radical Candor Ким Скотт, идеальная обратная связь сочетает в себе...",
    textEn: "In Kim Scott's Radical Candor model, ideal feedback combines...",
    options: [
      { key: "a", text: "Личную заботу и прямой вызов", textEn: "Caring personally and challenging directly" },
      { key: "b", text: "Дипломатичность и избегание конкретики", textEn: "Diplomacy and avoiding specifics" },
      { key: "c", text: "Жёсткую критику и высокие стандарты", textEn: "Harsh criticism and high standards" },
      { key: "d", text: "Похвалу на публике и критику наедине", textEn: "Praise in public and criticism in private" },
    ],
    correctAnswer: "a",
    explanation: "Radical Candor строится на двух осях: Care Personally (личная забота) и Challenge Directly (прямой вызов). Когда ты искренне заботишься о человеке И при этом говоришь ему правду прямо — это и есть Radical Candor.",
    explanationEn: "Radical Candor is built on two axes: Care Personally and Challenge Directly. When you genuinely care about someone AND tell them the truth directly — that's Radical Candor.",
    source: "Kim Scott — Radical Candor",
    sourceUrl: "https://www.radicalcandor.com/",
  },
  {
    id: "cl_q03",
    dimension: "collaboration",
    text: "Какие стадии развития команды описал Брюс Такман в правильном порядке?",
    textEn: "What are Tuckman's stages of team development in the correct order?",
    options: [
      { key: "a", text: "Norming \u2192 Forming \u2192 Storming \u2192 Performing", textEn: "Norming \u2192 Forming \u2192 Storming \u2192 Performing" },
      { key: "b", text: "Forming \u2192 Storming \u2192 Norming \u2192 Performing", textEn: "Forming \u2192 Storming \u2192 Norming \u2192 Performing" },
      { key: "c", text: "Storming \u2192 Forming \u2192 Performing \u2192 Norming", textEn: "Storming \u2192 Forming \u2192 Performing \u2192 Norming" },
      { key: "d", text: "Forming \u2192 Norming \u2192 Storming \u2192 Performing", textEn: "Forming \u2192 Norming \u2192 Storming \u2192 Performing" },
    ],
    correctAnswer: "b",
    explanation: "Модель Такмана: Forming (формирование), Storming (шторм), Norming (нормализация), Performing (производительность). Позже была добавлена пятая стадия — Adjourning.",
    explanationEn: "Tuckman's model: Forming, Storming, Norming, Performing. A fifth stage — Adjourning — was added later.",
    source: "Bruce Tuckman — Developmental Sequence in Small Groups",
    sourceUrl: "https://en.wikipedia.org/wiki/Tuckman%27s_stages_of_group_development",
  },

  // ─── Leadership (3 questions from quiz-batch-2.json) ───
  {
    id: "ld_q01",
    dimension: "leadership",
    text: "В модели ситуационного лидерства Херси и Бланшара, для сотрудника, который компетентен, но демотивирован, лучше всего подходит стиль...",
    textEn: "In the Hersey-Blanchard Situational Leadership model, for an employee who is competent but unmotivated, the best style is...",
    options: [
      { key: "a", text: "Directing (директивный) — чёткие инструкции и контроль", textEn: "Directing — clear instructions and close supervision" },
      { key: "b", text: "Coaching (наставничество) — объяснения и поддержка", textEn: "Coaching — explanation and support" },
      { key: "c", text: "Supporting (поддерживающий) — участие в принятии решений, меньше контроля", textEn: "Supporting — shared decision-making, less supervision" },
      { key: "d", text: "Delegating (делегирующий) — полная автономия", textEn: "Delegating — full autonomy" },
    ],
    correctAnswer: "c",
    explanation: "Supporting подходит для людей с высокой компетенцией, но низкой мотивацией (S3 по модели). Им не нужны инструкции — они знают как делать. Им нужна поддержка: вовлечение в решения, признание, понимание причин демотивации.",
    explanationEn: "Supporting fits people with high competence but low motivation (S3). They don't need instructions — they know how. They need support: involvement in decisions, recognition, understanding why they're demotivated.",
    source: "Hersey & Blanchard — Situational Leadership",
    sourceUrl: "https://en.wikipedia.org/wiki/Situational_leadership_theory",
  },
  {
    id: "ld_q02",
    dimension: "leadership",
    text: "Согласно концепции Servant Leadership Роберта Гринлифа, главная роль лидера — это...",
    textEn: "According to Robert Greenleaf's Servant Leadership, the primary role of a leader is to...",
    options: [
      { key: "a", text: "Задавать стратегическое направление и принимать ключевые решения", textEn: "Set strategic direction and make key decisions" },
      { key: "b", text: "Служить потребностям команды и помогать каждому раскрыть потенциал", textEn: "Serve the team's needs and help everyone reach their potential" },
      { key: "c", text: "Контролировать выполнение задач и соблюдение дедлайнов", textEn: "Monitor task completion and deadline adherence" },
      { key: "d", text: "Вдохновлять команду яркой визией будущего", textEn: "Inspire the team with a bold vision of the future" },
    ],
    correctAnswer: "b",
    explanation: "Servant Leadership переворачивает пирамиду: лидер не наверху, а внизу. Его задача — устранять препятствия, обеспечивать ресурсы и создавать условия, в которых каждый может расти и эффективно работать.",
    explanationEn: "Servant Leadership flips the pyramid: the leader is at the bottom, not the top. Their job is to remove obstacles, provide resources, and create conditions where everyone can grow and work effectively.",
    source: "Robert Greenleaf — Servant Leadership",
    sourceUrl: "https://www.greenleaf.org/what-is-servant-leadership/",
  },
  {
    id: "ld_q03",
    dimension: "leadership",
    text: "В чём основное отличие трансформационного лидерства от транзакционного?",
    textEn: "What is the main difference between transformational and transactional leadership?",
    options: [
      { key: "a", text: "Трансформационное использует штрафы, транзакционное — бонусы", textEn: "Transformational uses penalties, transactional uses bonuses" },
      { key: "b", text: "Трансформационное вдохновляет на изменения и рост, транзакционное управляет через обмен (задача-награда)", textEn: "Transformational inspires change and growth, transactional manages through exchange (task-reward)" },
      { key: "c", text: "Трансформационное для больших компаний, транзакционное для стартапов", textEn: "Transformational is for large companies, transactional for startups" },
      { key: "d", text: "Разницы нет — это синонимы", textEn: "There's no difference — they're synonyms" },
    ],
    correctAnswer: "b",
    explanation: "Транзакционное лидерство работает через обмен: «сделай задачу — получи бонус/избежи штрафа». Трансформационное — вдохновляет людей превзойти собственные ожидания, развиваться, менять подход к работе. В эпоху AI, когда рутина автоматизируется, трансформационное лидерство становится критически важным.",
    explanationEn: "Transactional leadership works through exchange: 'complete the task — get a bonus/avoid penalty'. Transformational inspires people to exceed their own expectations, develop, and change their approach to work. In the AI era, as routine gets automated, transformational leadership becomes critical.",
    source: "James MacGregor Burns — Leadership",
    sourceUrl: "https://en.wikipedia.org/wiki/Transformational_leadership",
  },

  // ─── Conflict Resolution (3 questions from quiz-batch-2.json) ───
  {
    id: "cr_q01",
    dimension: "conflict_resolution",
    text: "В модели Томаса-Килманна (TKI) выделяется 5 стилей поведения в конфликте. Какой стиль сочетает высокую ассертивность И высокую кооперативность?",
    textEn: "The Thomas-Kilmann Conflict Mode Instrument (TKI) identifies 5 conflict styles. Which style combines high assertiveness AND high cooperativeness?",
    options: [
      { key: "a", text: "Компромисс (Compromising)", textEn: "Compromising" },
      { key: "b", text: "Сотрудничество (Collaborating)", textEn: "Collaborating" },
      { key: "c", text: "Соперничество (Competing)", textEn: "Competing" },
      { key: "d", text: "Приспособление (Accommodating)", textEn: "Accommodating" },
    ],
    correctAnswer: "b",
    explanation: "Collaborating (сотрудничество) — единственный стиль, где обе оси высокие. Это win-win подход: стороны работают вместе, чтобы найти решение, удовлетворяющее всех. Требует больше времени и доверия, но даёт наилучший результат для отношений и задачи.",
    explanationEn: "Collaborating is the only style with both axes high. It's a win-win approach: parties work together to find a solution satisfying everyone. Requires more time and trust but gives the best outcome for relationships and the task.",
    source: "Thomas & Kilmann — TKI Conflict Mode Instrument",
    sourceUrl: "https://en.wikipedia.org/wiki/Thomas%E2%80%93Kilmann_Conflict_Mode_Instrument",
  },
  {
    id: "cr_q02",
    dimension: "conflict_resolution",
    text: "Техника «Я-высказывание» при конфликте предполагает формулировку...",
    textEn: "The 'I-statement' technique in conflict involves the formulation...",
    options: [
      { key: "a", text: "«Ты всегда делаешь X, это неправильно»", textEn: "'You always do X, that's wrong'" },
      { key: "b", text: "«Когда происходит X, я чувствую Y, потому что Z»", textEn: "'When X happens, I feel Y, because Z'" },
      { key: "c", text: "«Я думаю, что ты не прав, и вот почему»", textEn: "'I think you're wrong, and here's why'" },
      { key: "d", text: "«Все считают, что нужно делать по-другому»", textEn: "'Everyone thinks it should be done differently'" },
    ],
    correctAnswer: "b",
    explanation: "Я-высказывание переносит фокус с обвинения на описание ситуации и своих чувств: «Когда [факт], я чувствую [эмоция], потому что [потребность]». Это снижает защитную реакцию собеседника и открывает пространство для диалога вместо эскалации.",
    explanationEn: "I-statements shift focus from blame to describing the situation and your feelings: 'When [fact], I feel [emotion], because [need]'. This reduces the other person's defensiveness and opens space for dialogue instead of escalation.",
    source: "Thomas Gordon — Leader Effectiveness Training",
    sourceUrl: "https://en.wikipedia.org/wiki/I-message",
  },
  {
    id: "cr_q03",
    dimension: "conflict_resolution",
    text: "На код-ревью возник спор: использовать готовое AI-решение или переписать вручную. Какой подход к разрешению наиболее конструктивен?",
    textEn: "A code review dispute arises: use the AI-generated solution or rewrite manually. Which resolution approach is most constructive?",
    options: [
      { key: "a", text: "Решает тот, кто старше по должности", textEn: "The more senior person decides" },
      { key: "b", text: "Оценить конкретные риски и преимущества обоих подходов на основе данных", textEn: "Evaluate specific risks and benefits of both approaches based on data" },
      { key: "c", text: "Компромисс: переписать половину вручную", textEn: "Compromise: rewrite half manually" },
      { key: "d", text: "Голосование в команде", textEn: "Team vote" },
    ],
    correctAnswer: "b",
    explanation: "Конструктивное разрешение технических споров основано на данных, а не на авторитете или голосовании. Оцените: какие конкретно риски несёт AI-решение? Какие преимущества? Сколько времени займёт переписывание? Какие метрики можно использовать для оценки? Это превращает спор в анализ.",
    explanationEn: "Constructive resolution of technical disputes is based on data, not authority or voting. Evaluate: what specific risks does the AI solution carry? What advantages? How long will rewriting take? What metrics can be used? This transforms argument into analysis.",
    source: "Soft Skills Guide: Conflict Resolution",
    sourceUrl: "/guide/conflict-resolution",
  },

  // ─── Emotional Intelligence (3 questions from quiz-batch-2.json) ───
  {
    id: "ei_q01",
    dimension: "emotional_intelligence",
    text: "Модель эмоционального интеллекта Дэниела Гоулмана включает 5 компонентов. Какой из них НЕ входит в модель?",
    textEn: "Daniel Goleman's emotional intelligence model includes 5 components. Which one is NOT part of the model?",
    options: [
      { key: "a", text: "Самосознание (Self-awareness)", textEn: "Self-awareness" },
      { key: "b", text: "Саморегуляция (Self-regulation)", textEn: "Self-regulation" },
      { key: "c", text: "Когнитивная гибкость (Cognitive flexibility)", textEn: "Cognitive flexibility" },
      { key: "d", text: "Эмпатия (Empathy)", textEn: "Empathy" },
    ],
    correctAnswer: "c",
    explanation: "5 компонентов EQ по Гоулману: самосознание, саморегуляция, мотивация, эмпатия, социальные навыки. Когнитивная гибкость — важный навык, но он относится к когнитивным функциям, а не к эмоциональному интеллекту в модели Гоулмана.",
    explanationEn: "Goleman's 5 EQ components: self-awareness, self-regulation, motivation, empathy, social skills. Cognitive flexibility is an important skill but belongs to cognitive functions, not emotional intelligence in Goleman's model.",
    source: "Daniel Goleman — Emotional Intelligence",
    sourceUrl: "https://www.danielgoleman.info/",
  },
  {
    id: "ei_q02",
    dimension: "emotional_intelligence",
    text: "Что такое «эмоциональное заражение» (emotional contagion)?",
    textEn: "What is 'emotional contagion'?",
    options: [
      { key: "a", text: "Манипуляция чужими эмоциями для достижения целей", textEn: "Manipulating others' emotions to achieve goals" },
      { key: "b", text: "Неосознанное «копирование» эмоций окружающих людей", textEn: "Unconscious 'copying' of emotions from surrounding people" },
      { key: "c", text: "Осознанная эмпатия и сочувствие", textEn: "Conscious empathy and compassion" },
      { key: "d", text: "Подавление своих эмоций в групповых ситуациях", textEn: "Suppressing your emotions in group situations" },
    ],
    correctAnswer: "b",
    explanation: "Эмоциональное заражение — это автоматический, неосознанный процесс, при котором мы «подхватываем» эмоции окружающих. Если лидер в стрессе — команда тоже будет в стрессе. Если коллега раздражён борьбой с AI — это может передаться всей команде. Осознание этого механизма — первый шаг к управлению им.",
    explanationEn: "Emotional contagion is an automatic, unconscious process where we 'catch' emotions from people around us. If the leader is stressed, the team will be too. If a colleague is frustrated with AI, it can spread to the whole team. Awareness of this mechanism is the first step to managing it.",
    source: "Hatfield et al. — Emotional Contagion",
    sourceUrl: "https://en.wikipedia.org/wiki/Emotional_contagion",
  },
  {
    id: "ei_q03",
    dimension: "emotional_intelligence",
    text: "Когда коллега выражает фрустрацию от работы с AI-инструментами, наиболее эмоционально интеллигентная реакция — это...",
    textEn: "When a colleague expresses frustration with AI tools, the most emotionally intelligent response is...",
    options: [
      { key: "a", text: "Сказать «не переживай, со временем привыкнешь»", textEn: "Say 'don't worry, you'll get used to it'" },
      { key: "b", text: "Показать свой экран и объяснить, как правильно пользоваться инструментом", textEn: "Show your screen and explain how to use the tool correctly" },
      { key: "c", text: "Признать чувства, выслушать и предложить помощь, когда человек будет готов", textEn: "Acknowledge feelings, listen, and offer help when they're ready" },
      { key: "d", text: "Согласиться, что AI-инструменты ужасны, чтобы проявить солидарность", textEn: "Agree that AI tools are terrible to show solidarity" },
    ],
    correctAnswer: "c",
    explanation: "Эмоционально интеллигентная реакция сначала валидирует чувства («понимаю, это может быть фрустрирующим»), потом слушает, и только потом предлагает помощь. «Не переживай» обесценивает эмоции, немедленные советы игнорируют чувства, а ложное согласие не решает проблему.",
    explanationEn: "An emotionally intelligent response first validates feelings ('I understand this can be frustrating'), then listens, and only then offers help. 'Don't worry' invalidates emotions, immediate advice ignores feelings, and false agreement doesn't solve the problem.",
    source: "Daniel Goleman — Emotional Intelligence",
    sourceUrl: "https://www.danielgoleman.info/",
  },

  // ─── Time Management (3 questions from quiz-batch-2.json) ───
  {
    id: "tm_q01",
    dimension: "time_management",
    text: "Закон Паркинсона гласит, что...",
    textEn: "Parkinson's Law states that...",
    options: [
      { key: "a", text: "Чем больше людей в команде, тем больше времени уходит на согласование", textEn: "The more people on a team, the more time is spent on alignment" },
      { key: "b", text: "Работа заполняет всё время, отведённое на неё", textEn: "Work expands to fill the time available for its completion" },
      { key: "c", text: "20% усилий дают 80% результата", textEn: "20% of effort gives 80% of results" },
      { key: "d", text: "Всё, что может пойти не так, пойдёт не так", textEn: "Anything that can go wrong will go wrong" },
    ],
    correctAnswer: "b",
    explanation: "Закон Паркинсона: «Работа заполняет всё время, отведённое на её выполнение». Если дать на задачу неделю — она займёт неделю, даже если реально нужен день. С AI это особенно актуально: можно бесконечно генерировать и улучшать, если не поставить жёсткие рамки.",
    explanationEn: "Parkinson's Law: 'Work expands to fill the time available for its completion.' If you give a week for a task, it'll take a week, even if it really needs a day. With AI this is especially relevant: you can endlessly generate and improve without hard deadlines.",
    source: "C. Northcote Parkinson — Parkinson's Law",
    sourceUrl: "https://en.wikipedia.org/wiki/Parkinson%27s_law",
  },
  {
    id: "tm_q02",
    dimension: "time_management",
    text: "Матрица Эйзенхауэра делит задачи на 4 квадранта. Задачи, которые важные, но НЕ срочные, нужно...",
    textEn: "The Eisenhower Matrix divides tasks into 4 quadrants. Tasks that are important but NOT urgent should be...",
    options: [
      { key: "a", text: "Делать немедленно", textEn: "Done immediately" },
      { key: "b", text: "Запланировать и делать в выделенное время", textEn: "Scheduled and done at a dedicated time" },
      { key: "c", text: "Делегировать", textEn: "Delegated" },
      { key: "d", text: "Удалить из списка", textEn: "Removed from the list" },
    ],
    correctAnswer: "b",
    explanation: "Квадрант 2 (важное, но не срочное) — самый ценный. Сюда попадают стратегические задачи: обучение, планирование, профилактика. Их нужно планировать и защищать время для них. Если не планировать — они никогда не будут сделаны, потому что срочные задачи всегда побеждают.",
    explanationEn: "Quadrant 2 (important but not urgent) is the most valuable. Strategic tasks go here: learning, planning, prevention. They need scheduled protected time. Without planning, they'll never get done because urgent tasks always win.",
    source: "Stephen Covey — The 7 Habits of Highly Effective People",
    sourceUrl: "https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People",
  },
  {
    id: "tm_q03",
    dimension: "time_management",
    text: "Когда стоит отказаться от AI и написать код вручную?",
    textEn: "When should you stop using AI and write code manually?",
    options: [
      { key: "a", text: "Никогда — AI всегда быстрее", textEn: "Never — AI is always faster" },
      { key: "b", text: "Всегда — AI снижает качество кода", textEn: "Always — AI reduces code quality" },
      { key: "c", text: "Когда задача простая и хорошо понятная, а промптинг займёт больше времени, чем ручное написание", textEn: "When the task is simple and well-understood, and prompting would take longer than writing manually" },
      { key: "d", text: "Когда работаешь с legacy-кодом", textEn: "When working with legacy code" },
    ],
    correctAnswer: "c",
    explanation: "Правило: если ты точно знаешь, что написать, и это займёт 5-10 минут — пиши вручную. Промпт + ожидание + проверка + правки могут занять больше времени. AI эффективен для сложных, объёмных или незнакомых задач. Для простых и хорошо понятных — ручная работа быстрее.",
    explanationEn: "Rule: if you know exactly what to write and it'll take 5-10 minutes — write it manually. Prompt + waiting + checking + fixes can take longer. AI is effective for complex, large, or unfamiliar tasks. For simple and well-understood ones — manual work is faster.",
    source: "Soft Skills Guide: Time Management",
    sourceUrl: "/guide/time-management",
  },
];

/**
 * Get random N questions for given dimensions.
 * Returns `count` questions per dimension, shuffled together.
 * From a pool of 20 per topic, picks `count` random ones — different every run.
 */
export function getRandomQuizQuestions(
  dimensions: string[],
  count: number = 5
): QuizQuestion[] {
  const result: QuizQuestion[] = [];
  for (const dim of dimensions) {
    const dimQs = quizQuestions.filter((q) => q.dimension === dim);
    const shuffled = [...dimQs].sort(() => Math.random() - 0.5);
    result.push(...shuffled.slice(0, count));
  }
  return result.sort(() => Math.random() - 0.5);
}
