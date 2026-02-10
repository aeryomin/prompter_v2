"use client";

import { useEffect, useState, useRef } from "react";
import { UrlAnalyzerForm } from "@/components/url-analyzer-form";
import { ModelSelector } from "../components/model-selector";
import { PromptBuilder } from "../components/prompt-builder";

type ModelOption = {
  id: string;
  model_name: string;
  created_at: string;
};

export default function HomePage() {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const constructorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoadingModels(true);
      setModelsError(null);

      try {
        const res = await fetch("/api/models");
        const data = await res.json();

        if (!res.ok) {
          if (!cancelled) {
            setModelsError(
              data.error ?? "Не удалось загрузить список моделей",
            );
          }
          return;
        }

        if (!cancelled) {
          setModels(data.models ?? []);
        }
      } catch {
        if (!cancelled) {
          setModelsError("Ошибка сети при загрузке моделей");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-lg font-medium">Анализ документации</h2>
        <p className="text-sm text-slate-400">
          Вставьте ссылку на официальную документацию модели (например, Veo 3
          или Kling). Система извлечёт правила промптинга и сохранит структуру
          модели.
        </p>
        <UrlAnalyzerForm
          onModelCreated={(model) => {
            setModels((prev) => {
              const nextModel: ModelOption = {
                id: model.id,
                model_name: model.model_name,
                created_at: model.created_at ?? new Date().toISOString(),
              };

              const withoutDup = prev.filter((m) => m.id !== nextModel.id);

              return [nextModel, ...withoutDup];
            });

            setSelectedModelId(model.id);

            if (constructorRef.current) {
              constructorRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </section>
      <section
        ref={constructorRef}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Интерактивный конструктор</h2>
          <p className="text-sm text-slate-400">
            Выберите модель и заполните её параметры. Вводите данные на русском
            — система подготовит финальный промпт на английском.
          </p>
        </div>
        <ModelSelector
          value={selectedModelId}
          onChange={(id) => setSelectedModelId(id)}
          models={models}
          isLoading={isLoadingModels}
          errorMessage={modelsError}
        />
        <PromptBuilder modelId={selectedModelId || undefined} />
      </section>
    </div>
  );
}

