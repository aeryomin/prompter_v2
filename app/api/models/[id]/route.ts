import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseClient } from "@/lib/supabase";
import { ConfigSchema, type ModelConfig } from "@/lib/configSchema";

export const runtime = "edge";

const ParamsSchema = z.object({
  id: z.string(),
});

export async function GET(
  _req: NextRequest,
  context: { params: any },
) {
  const params = await context.params;
  const parseResult = ParamsSchema.safeParse(params);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Некорректный идентификатор модели" },
      { status: 400 },
    );
  }

  const { id } = parseResult.data;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("models")
    .select("id, model_name, config")
    .eq("id", id)
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

  return NextResponse.json(
    {
      model: {
        id: row.id,
        model_name: row.model_name,
        config,
      },
    },
    { status: 200 },
  );
}

