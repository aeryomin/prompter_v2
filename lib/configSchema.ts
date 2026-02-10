import { z } from "zod";

export const FieldSchema = z.object({
  name: z.string(),
  description: z.string(),
  example: z.string(),
  type: z.enum(["text", "select", "number"]),
});

export const ConfigSchema = z.object({
  model_name: z.string(),
  is_documentation: z.boolean(),
  fields: z.array(FieldSchema),
  syntax_rules: z.object({
    separator: z.string(),
    prefix: z.string(),
    suffix: z.string(),
    weight_format: z.string(),
  }),
});

export type ModelConfig = z.infer<typeof ConfigSchema>;

