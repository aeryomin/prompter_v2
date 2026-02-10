# spec.md: Project "Prompter v2"

## 1. Project Overview
**Prompter** — веб-приложение для автоматизации создания идеальных промптов. Система анализирует документацию ИИ-моделей (Veo 3, Kling и др.) по ссылке, извлекает правила и создает динамический конструктор промптов.

## 2. Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui + Lucide Icons
- **Database:** Supabase (PostgreSQL) — для хранения структур моделей
- **AI Integration:** Vercel AI SDK
- **LLM API:** Google Gemini 1.5 Flash (бесплатный уровень через Google AI Studio)
- **Scraper:** Jina Reader API (https://r.jina.ai/)

## 3. Core Features & Flow

### Phase 1: Анализ документации (Admin/User Flow)
1. **Input:** Пользователь вводит URL документации.
2. **Scraping:** Приложение делает запрос к `https://r.jina.ai/{URL}` для получения Markdown-текста.
3. **AI Analysis:** Текст отправляется в Gemini с требованием вернуть JSON.
    - **Validation:** Если в тексте нет правил промптинга, вернуть ошибку "Документация не обнаружена".
4. **Storage:** Сохранение названия модели и её параметров в БД.

### Phase 2: Интерактивный конструктор (User Flow)
1. **Selection:** Выбор модели из списка (например, "Kling AI").
2. **Dynamic Form:** Форма генерируется на лету на основе сохраненного JSON (поля для сцены, освещения, движения камеры и т.д.).
3. **Generation:** - Пользователь вводит данные на русском.
    - LLM переводит ввод на английский.
    - LLM упаковывает перевод в структуру промпта, согласно правилам этой модели.
4. **Output:** Финальный текстовый промпт с кнопкой "Копировать".

## 4. Data Schema (JSON Structure)
Модель в базе данных должна содержать поле `config` со следующей структурой:
```json
{
  "model_name": "string",
  "is_documentation": "boolean",
  "fields": [
    {
      "name": "string",
      "description": "string",
      "example": "string",
      "type": "text | select | number"
    }
  ],
  "syntax_rules": {
    "separator": "string",
    "prefix": "string",
    "suffix": "string",
    "weight_format": "string"
  }
}
```

## 5. Boundary Cases & Errors
- **Мусорная ссылка**: Если LLM определяет is_documentation: false, выводить Toast-уведомление об ошибке.

- **Огромный текст**: Использовать длинное контекстное окно Gemini 1.5 Flash (без обрезки).

- **Таймауты Vercel**: Для анализа использовать Edge Runtime или Streaming, чтобы обойти лимит в 10 секунд.

## 6. Cursor Instructions
- спользуй shadcn/ui для всех компонентов интерфейса.

- Весь пользовательский интерфейс должен быть на русском языке.

- Логику парсинга выноси в app/api/analyze/route.ts.

- Используй zod для валидации JSON ответов от ИИ.