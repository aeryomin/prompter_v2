import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Переменные окружения Supabase не заданы");
  }

  return createClient<Database>(url, anonKey);
}

