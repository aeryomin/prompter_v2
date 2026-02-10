import { UrlAnalyzerForm } from "@/components/url-analyzer-form";
import { ModelSelector } from "@/components/model-selector";
import { PromptBuilder } from "@/components/prompt-builder";

export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-lg font-medium">Анализ документации</h2>
        <p className="text-sm text-slate-400">
          Вставьте ссылку на официальную документацию модели (например, Veo 3
          или Kling). Система извлечёт правила промптинга и сохранит структуру
          модели.
        </p>
        <UrlAnalyzerForm />
      </section>
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Интерактивный конструктор</h2>
          <p className="text-sm text-slate-400">
            Выберите модель и заполните её параметры. Вводите данные на русском
            — система подготовит финальный промпт на английском.
          </p>
        </div>
        <ModelSelector />
        <PromptBuilder />
      </section>
    </div>
  );
}

