import type { ModelConfig } from "../configSchema";
import type { PromptBuilderInput } from "../prompt-builder/promptBuilderSchema";

export function modelConfigToPromptBuilderInput(params: {
  config: ModelConfig;
  modelIdentifier?: string;
}): PromptBuilderInput {
  const { config, modelIdentifier } = params;

  return {
    modelIdentifier: modelIdentifier ?? config.model_name,
    formFields: config.fields.map((field) => ({
      name: field.name,
      label: field.name,
      description: field.description,
      example: field.example,
      inputType: field.type,
    })),
    composition: {
      fieldSeparator: config.syntax_rules.separator,
      promptPrefix: config.syntax_rules.prefix,
      promptSuffix: config.syntax_rules.suffix,
      weightFormat: config.syntax_rules.weight_format || undefined,
      translationRequired: true,
    },
  };
}

