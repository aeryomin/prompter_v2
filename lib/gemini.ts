import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import {
  AnalysisResultSchema,
  type AnalysisResult,
} from "./analysis/analysisSchema";

export async function analyzeDocumentation(
  markdown: string,
): Promise<AnalysisResult> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: AnalysisResultSchema,
      prompt: [
        "Ты — система, которая анализирует документацию моделей ИИ и возвращает JSON по заданной схеме.",
        "",
        "- Поле modelName ДОЛЖНО точно совпадать с официальным названием модели из документации",
        "  (например, \"Veo 3\", \"Kling AI\" и т.п.), без добавления даты, времени, версий анализа и т.п.",
        "- Поле isDocumentation — boolean, отражает, действительно ли текст является документацией по использованию модели и содержит правила промптинга.",
        "- Поле fields — массив объектов с ключами identifier, label, description, example, fieldType.",
        "- Поле syntax — объект с ключами separator, prefix, suffix, weightFormat.",
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

