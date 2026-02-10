import { z } from "zod";

export const PromptFormFieldDefinitionSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string(),
  example: z.string(),
  inputType: z.enum(["text", "select", "number"]),
});

export const PromptCompositionRulesSchema = z.object({
  fieldSeparator: z.string(),
  promptPrefix: z.string(),
  promptSuffix: z.string(),
  weightFormat: z.string().optional(),
  translationRequired: z.boolean().optional(),
});

export const PromptBuilderInputSchema = z.object({
  modelIdentifier: z.string(),
  formFields: z.array(PromptFormFieldDefinitionSchema),
  composition: PromptCompositionRulesSchema,
});

export type PromptFormFieldDefinition = z.infer<
  typeof PromptFormFieldDefinitionSchema
>;
export type PromptCompositionRules = z.infer<
  typeof PromptCompositionRulesSchema
>;
export type PromptBuilderInput = z.infer<typeof PromptBuilderInputSchema>;

