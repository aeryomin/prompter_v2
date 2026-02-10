import type { ModelConfig } from "../configSchema";
import type { AnalysisResult } from "../analysis/analysisSchema";

export function analysisResultToModelConfig(
  analysis: AnalysisResult,
): ModelConfig {
  return {
    model_name: analysis.modelName,
    is_documentation: analysis.isDocumentation,
    fields: analysis.fields.map((field) => ({
      name: field.identifier,
      description: field.description,
      example: field.example,
      type: field.fieldType,
    })),
    syntax_rules: {
      separator: analysis.syntax.separator,
      prefix: analysis.syntax.prefix,
      suffix: analysis.syntax.suffix,
      weight_format: analysis.syntax.weightFormat ?? "",
    },
  };
}

export function modelConfigToAnalysisResult(
  config: ModelConfig,
): AnalysisResult {
  return {
    modelName: config.model_name,
    isDocumentation: config.is_documentation,
    fields: config.fields.map((field) => ({
      identifier: field.name,
      label: field.name,
      description: field.description,
      example: field.example,
      fieldType: field.type,
    })),
    syntax: {
      separator: config.syntax_rules.separator,
      prefix: config.syntax_rules.prefix,
      suffix: config.syntax_rules.suffix,
      weightFormat: config.syntax_rules.weight_format || undefined,
    },
  };
}

