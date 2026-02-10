import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompter v2",
  description: "Конструктор промптов для моделей ИИ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
          <header className="mb-6 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-semibold">Prompter v2</h1>
            <p className="mt-1 text-sm text-slate-400">
              Веб-приложение для автоматизации создания идеальных промптов.
            </p>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

