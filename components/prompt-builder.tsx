"use client";

import { useEffect, useState } from "react";
import type { PromptBuilderInput } from "@/lib/prompt-builder/promptBuilderSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type PromptBuilderProps = {
  modelId?: string;
};

export function PromptBuilder({ modelId }: PromptBuilderProps) {
  const [config, setConfig] = useState<PromptBuilderInput | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfig(null);
    setValues({});
    setPrompt(null);
    setError(null);

    if (!modelId) {
      return;
    }

    let cancelled = false;

    async function loadConfig() {
      setIsLoadingConfig(true);
      try {
        const res = await fetch(`/api/models/${modelId}`);
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) {
            setError(data.error ?? "Не удалось загрузить конфигурацию модели");
          }
          return;
        }

        if (!cancelled) {
          setConfig(data.model.promptConfig);
        }
      } catch {
        if (!cancelled) {
          setError("Ошибка сети при загрузке конфигурации модели");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConfig(false);
        }
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [modelId]);

  const handleFieldChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!modelId || !config) {
      setError("Сначала выберите модель и дождитесь загрузки конфигурации");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setPrompt(null);

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId,
          fields: values,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Не удалось сгенерировать промпт");
        return;
      }

      setPrompt(data.prompt);
    } catch {
      setError("Ошибка сети при генерации промпта");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!modelId) {
    return (
      <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-400">
        Сначала выберите модель, чтобы увидеть доступные поля конструктора.
      </div>
    );
  }

  if (isLoadingConfig) {
    return (
      <div className="rounded-md border border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-400">
        Загружаем конфигурацию модели...
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-400">
        Конфигурация модели не загружена. Убедитесь, что модель сохранена через
        анализ документации.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-slate-300">
          Поля модели{" "}
          <span className="font-medium">{config.modelIdentifier}</span>:
        </p>
        <div className="space-y-3">
          {config.formFields.map((field) => {
            const value = values[field.name] ?? "";

            return (
              <div
                key={field.name}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-900/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Label>{field.label}</Label>
                  <span className="text-xs uppercase text-slate-500">
                    {field.inputType}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {field.description}{" "}
                  {field.example && (
                    <span className="text-slate-500">
                      Пример: <span className="italic">{field.example}</span>
                    </span>
                  )}
                </p>
                {field.inputType === "text" && (
                  <Textarea
                    value={value}
                    onChange={(event) =>
                      handleFieldChange(field.name, event.target.value)
                    }
                    placeholder="Опишите значение на русском языке"
                  />
                )}
                {field.inputType === "number" && (
                  <Input
                    type="number"
                    value={value}
                    onChange={(event) =>
                      handleFieldChange(field.name, event.target.value)
                    }
                    placeholder="Числовое значение"
                  />
                )}
                {field.inputType === "select" && (
                  <Input
                    value={value}
                    onChange={(event) =>
                      handleFieldChange(field.name, event.target.value)
                    }
                    placeholder="Значение из ограниченного набора (введите на русском)"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Генерируем промпт..." : "Сгенерировать промпт"}
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {prompt && (
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Итоговый промпт:</p>
          <Textarea
            readOnly
            value={prompt}
            className="font-mono text-xs leading-relaxed"
          />
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(prompt).catch(() => {});
            }}
          >
            Скопировать промпт
          </Button>
        </div>
      )}
    </div>
  );
}

