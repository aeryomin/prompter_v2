import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { ConfigSchema, type ModelConfig } from "./configSchema";

export async function analyzeDocumentation(
  markdown: string,
): Promise<ModelConfig> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: ConfigSchema,
      prompt: [
        "Ты — система, которая анализирует документацию моделей ИИ и возвращает JSON-конфиг по заданной схеме.",
        "",
        "- Поле model_name ДОЛЖНО точно совпадать с официальным названием модели из документации",
        "  (например, \"Veo 3\", \"Kling AI\" и т.п.), без добавления даты, времени, версий анализа и т.п.",
        "",
        "Вот полная документация модели в формате Markdown:",
        markdown,
      ].join("\n"),
    });

    return object;
  } catch (error) {
    throw new Error("Ошибка анализа документации Gemini");
  }
}

