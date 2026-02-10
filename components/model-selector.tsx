"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ModelSelectorProps = {
  value?: string;
  onChange?: (value: string) => void;
  models: ModelOption[];
  isLoading?: boolean;
  errorMessage?: string | null;
};

type ModelOption = {
  id: string;
  model_name: string;
  created_at: string;
};

export function ModelSelector({
  value,
  onChange,
  models,
  isLoading,
  errorMessage,
}: ModelSelectorProps) {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value || "");
  };

  const formatDateTime = (iso: string) =>
    new Date(iso)
      .toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");

  return (
    <div className="space-y-2">
      <Label>Модель для генерации промпта</Label>
      <select
        className={cn(
          "w-full rounded-md border border-input bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition hover:border-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40",
        )}
        value={value ?? ""}
        onChange={handleChange}
        disabled={!!isLoading || models.length === 0}
      >
        <option value="">Выберите модель</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.model_name} — {formatDateTime(model.created_at)}
          </option>
        ))}
      </select>
      {errorMessage ? (
        <p className="text-xs text-red-400">{errorMessage}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Список заполняется после анализа документации и сохранения моделей.
        </p>
      )}
    </div>
  );
}

