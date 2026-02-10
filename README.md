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
  - интерактивный конструктор промптов.
- `app/api/analyze/route.ts` — API‑роут для анализа документации (Edge Runtime, полный пайплайн Phase 1).
- `app/api/models/route.ts` — API для получения списка сохранённых моделей.
- `app/api/models/[id]/route.ts` — API для получения конфигурации конкретной модели.
- `app/api/generate-prompt/route.ts` — API для генерации финального промпта на основе config + значений полей.
- `app/models/page.tsx` — страница со списком сохранённых моделей из Supabase.
- `lib/configSchema.ts` — `zod`‑схема JSON‑конфига модели и тип `ModelConfig`.
- `lib/supabase.ts` — вспомогательная функция для создания клиента Supabase.
- `lib/jina.ts` — обёртка для Jina Reader (`https://r.jina.ai/{URL}`).
- `lib/gemini.ts` — обёртка вызова Gemini через Vercel AI SDK для анализа документации.
- `types/database.ts` — типы схемы БД Supabase (таблица `models` с полем `config`).
- `components/url-analyzer-form.tsx` — форма ввода URL документации (использует shadcn/ui `Button`, `Input`, `Label`).
- `components/model-selector.tsx` — селектор модели с загрузкой списка из `/api/models`.
- `components/prompt-builder.tsx` — интерактивный конструктор промпта по сохранённому `config` и API `/api/generate-prompt`.

## Phase 2: интерактивный конструктор

Флоу Phase 2:

1. Пользователь выбирает модель в блоке «Интерактивный конструктор» (список берётся из Supabase через `/api/models`).
2. `PromptBuilder` загружает `config` выбранной модели через `/api/models/[id]` и строит форму по `config.fields`.
3. Пользователь заполняет поля на русском.
4. Форма отправляет данные на `/api/generate-prompt`, где Gemini 2.5 Flash переводит значения и собирает финальный промпт согласно `syntax_rules`.
5. Итоговый промпт отображается на странице с кнопкой «Скопировать».

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

