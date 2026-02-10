import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createSupabaseClient } from "@/lib/supabase";
import { ConfigSchema, type ModelConfig } from "@/lib/configSchema";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный JSON в запросе" },
      { status: 400 },
    );
  }

  const payload = body as {
    modelId?: unknown;
    fields?: unknown;
  };

  if (
    !payload ||
    typeof payload.modelId !== "string" ||
    typeof payload.fields !== "object" ||
    payload.fields === null
  ) {
    return NextResponse.json(
      { error: "Некорректные данные запроса" },
      { status: 400 },
    );
  }

  const modelId = payload.modelId;
  const fields = payload.fields as Record<string, unknown>;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("models")
    .select("id, model_name, config")
    .eq("id", modelId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Модель не найдена" },
      { status: 404 },
    );
  }

  const row = data as { id: string; model_name: string; config: unknown };

  const parsedConfig = ConfigSchema.safeParse(row.config);

  if (!parsedConfig.success) {
    return NextResponse.json(
      { error: "Конфигурация модели имеет некорректный формат" },
      { status: 500 },
    );
  }

  const config: ModelConfig = parsedConfig.data;

  try {
    const model = google("gemini-2.5-flash");

    const { text } = await generateText({
      model,
      prompt: [
        "Ты — помощник по созданию промптов для модели ИИ.",
        "У тебя есть JSON-конфиг модели с описанием полей и правил синтаксиса.",
        "Пользователь заполняет поля на русском, а твоя задача:",
        "1) Перевести значения полей на английский язык.",
        "2) Собрать итоговый промпт в виде одной строки согласно syntax_rules.",
        "",
        "Важные требования:",
        "- Возвращай ТОЛЬКО итоговый промпт одной строкой, без пояснений и без кавычек.",
        "- Не добавляй вокруг промпта никаких служебных слов.",
        "",
        "Конфиг модели (JSON):",
        JSON.stringify(config),
        "",
        "Значения полей, введённые пользователем на русском (JSON):",
        JSON.stringify(fields),
      ].join("\n"),
    });

    const promptText = text.trim();

    if (!promptText) {
      return NextResponse.json(
        { error: "Не удалось сгенерировать промпт" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        prompt: promptText,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Ошибка генерации промпта через Gemini" },
      { status: 500 },
    );
  }
}

