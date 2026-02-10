"use client";

import { useState } from "react";

export function UrlAnalyzerForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!url) {
      setError("Введите ссылку на документацию");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Произошла ошибка при анализе документации");
        return;
      }

      if (data.model?.model_name) {
        setMessage(`Модель "${data.model.model_name}" сохранена в базе.`);
      } else {
        setMessage("Анализ успешно завершён.");
      }
    } catch (e) {
      setError("Не удалось отправить запрос. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-200">
          Ссылка на документацию
        </label>
        <input
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition hover:border-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
          placeholder="https://..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Анализируем..." : "Анализировать документацию"}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && !error && (
        <p className="text-sm text-emerald-400">{message}</p>
      )}
    </form>
  );
}

