import { createSupabaseClient } from "@/lib/supabase";

export default async function ModelsPage() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("models")
    .select("id, model_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Сохранённые модели</h1>
        <p className="text-sm text-red-400">
          Не удалось загрузить список моделей.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Сохранённые модели</h1>
      {data && data.length > 0 ? (
        <ul className="space-y-2 text-sm text-slate-200">
          {data.map((model) => (
            <li
              key={model.id}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2"
            >
              <span>{model.model_name}</span>
              <span className="text-xs text-slate-500">
                {new Date(model.created_at).toLocaleString("ru-RU")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">
          Пока нет ни одной сохранённой модели.
        </p>
      )}
    </div>
  );
}

