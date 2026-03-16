import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soft Skills Check — Тренажёр soft skills",
  description:
    "Пойми себя лучше. 30 вопросов, AI-анализ, персональный план роста. Бесплатный open-source тренажёр.",
  openGraph: {
    title: "Тренажёр soft skills — пойми себя и расти",
    description:
      "Бесплатный AI-тренажёр: 30 вопросов, персональный анализ, план роста. Open source.",
    type: "website",
    url: "https://soft-skills.chillai.space",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-950 text-slate-200 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800/50">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  S
                </div>
                <span className="font-semibold text-slate-100">
                  Soft Skills Check
                </span>
              </a>
              <a
                href="https://github.com/job-search-toolkit/soft-skills-check"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/50 py-6">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-600">
              Open source project. MIT License.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
