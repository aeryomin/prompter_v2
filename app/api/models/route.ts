import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("models")
    .select("id, model_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Не удалось загрузить список моделей" },
      { status: 500 },
    );
  }

  return NextResponse.json({ models: data ?? [] }, { status: 200 });
}

