"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UrlAnalyzerFormProps = {
  onModelCreated?: (model: {
    id: string;
    model_name: string;
    created_at?: string;
  }) => void;
};

export function UrlAnalyzerForm({ onModelCreated }: UrlAnalyzerFormProps) {
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
        if (data.model.id) {
          onModelCreated?.({
            id: data.model.id,
            model_name: data.model.model_name,
            created_at: data.model.created_at,
          });
        }
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
        <Label>
          Ссылка на документацию
        </Label>
        <Input
          placeholder="https://..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Анализируем..." : "Анализировать документацию"}
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && !error && (
        <p className="text-sm text-emerald-400">{message}</p>
      )}
    </form>
  );
}

