import type { ModelConfig } from "@/lib/configSchema";

type PromptBuilderProps = {
  config?: ModelConfig;
};

export function PromptBuilder({ config }: PromptBuilderProps) {
  if (!config) {
    return (
      <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-400">
        Конфиг модели ещё не загружен. После анализа документации и выбора
        модели здесь появится интерактивный конструктор полей (сцена,
        освещение, движение камеры и т.д.).
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">
        Поля модели <span className="font-medium">{config.model_name}</span>:
      </p>
      <ul className="space-y-2 text-sm text-slate-200">
        {config.fields.map((field) => (
          <li
            key={field.name}
            className="rounded-md border border-slate-700 bg-slate-900/60 p-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{field.name}</span>
              <span className="text-xs uppercase text-slate-500">
                {field.type}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{field.description}</p>
            <p className="mt-1 text-xs text-slate-500">
              Пример: <span className="italic">{field.example}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

