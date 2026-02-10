import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchDocumentationMarkdown } from "@/lib/jina";
import { analyzeDocumentation } from "@/lib/gemini";
import { createSupabaseClient } from "@/lib/supabase";
import { ConfigSchema, type ModelConfig } from "@/lib/configSchema";

export const runtime = "edge";

const AnalyzeRequestSchema = z.object({
  url: z.string().url(),
});

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

  const parseResult = AnalyzeRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Ожидалось поле url с корректной ссылкой" },
      { status: 400 },
    );
  }

  const { url } = parseResult.data;

  try {
    const markdown = await fetchDocumentationMarkdown(url);
    const config = await analyzeDocumentation(markdown);

    const parsedConfig = ConfigSchema.safeParse(config);

    if (!parsedConfig.success) {
      return NextResponse.json(
        { error: "Ответ модели не соответствует ожидаемой схеме" },
        { status: 500 },
      );
    }

    const validConfig: ModelConfig = parsedConfig.data;

    if (!validConfig.is_documentation) {
      return NextResponse.json(
        { error: "Документация не обнаружена" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("models")
      .insert(
        {
          model_name: validConfig.model_name,
          config: validConfig,
        } as any,
      )
      .select("id, model_name, config")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Ошибка при сохранении модели в Supabase" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        model: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при анализе документации" },
      { status: 500 },
    );
  }
}

