# Prompter v2

Веб‑приложение для автоматизации создания идеальных промптов на основе официальной документации моделей ИИ (Veo 3, Kling и др.).

## Стек

- **Framework:** Next.js 15 (App Router)
- **Язык:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui (структура) + Lucide Icons
- **База данных:** Supabase (PostgreSQL)
- **AI Integration:** Vercel AI SDK (`ai`)
- **LLM API:** Google Gemini 1.5 Flash
- **Scraper:** Jina Reader API (`https://r.jina.ai/{URL}`)

## Ключевые файлы и директории

- `spec.md` — исходная спецификация проекта.
- `app/layout.tsx` — корневой layout приложения.
- `app/page.tsx` — главная страница с блоками:
  - анализ документации по URL;
  - интерактивный конструктор промптов (заглушка).
- `app/api/analyze/route.ts` — API‑роут для анализа документации (Edge Runtime, полный пайплайн Phase 1).
- `app/models/page.tsx` — страница со списком сохранённых моделей из Supabase.
- `lib/configSchema.ts` — `zod`‑схема JSON‑конфига модели и тип `ModelConfig`.
- `lib/supabase.ts` — вспомогательная функция для создания клиента Supabase.
- `lib/jina.ts` — обёртка для Jina Reader (`https://r.jina.ai/{URL}`).
- `lib/gemini.ts` — заготовка вызова Gemini через Vercel AI SDK.
- `types/database.ts` — типы схемы БД Supabase (таблица `models` с полем `config`).
- `components/url-analyzer-form.tsx` — форма ввода URL документации.
- `components/model-selector.tsx` — заглушка селекта модели.
- `components/prompt-builder.tsx` — заглушка конструктора промптов.

## Переменные окружения

Для работы Phase 1 необходимы:

- `GOOGLE_GENERATIVE_AI_API_KEY` — ключ доступа к Google Gemini 1.5 Flash (Google AI Studio / Vertex, используется `@ai-sdk/google`).
- `NEXT_PUBLIC_SUPABASE_URL` — URL проекта Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key из Supabase.

В Supabase должна существовать таблица `models` со столбцами как минимум:

- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz default now()`
- `model_name text`
- `config jsonb`

## Запуск

```bash
npm run dev
```

