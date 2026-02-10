"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ModelSelectorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

type ModelOption = {
  id: string;
  model_name: string;
};

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/models");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Не удалось загрузить список моделей");
          return;
        }

        if (!cancelled) {
          setModels(data.models ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Ошибка сети при загрузке моделей");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value || "");
  };

  return (
    <div className="space-y-2">
      <Label>Модель для генерации промпта</Label>
      <select
        className={cn(
          "w-full rounded-md border border-input bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition hover:border-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40",
        )}
        value={value ?? ""}
        onChange={handleChange}
        disabled={isLoading || models.length === 0}
      >
        <option value="">Выберите модель</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.model_name}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Список заполняется после анализа документации и сохранения моделей.
        </p>
      )}
    </div>
  );
}

