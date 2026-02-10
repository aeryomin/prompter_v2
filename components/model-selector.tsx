export function ModelSelector() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-200">
        Модель для генерации промпта
      </label>
      <select className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition hover:border-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40">
        <option value="">Выберите модель (пока заглушка)</option>
      </select>
      <p className="text-xs text-slate-500">
        Здесь позже появится список моделей из Supabase.
      </p>
    </div>
  );
}

