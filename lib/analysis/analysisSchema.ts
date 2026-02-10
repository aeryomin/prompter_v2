import { z } from "zod";

export const AnalysisFieldSchema = z.object({
  identifier: z.string(),
  label: z.string(),
  description: z.string(),
  example: z.string(),
  fieldType: z.enum(["text", "select", "number"]),
});

export const AnalysisSyntaxMetadataSchema = z.object({
  separator: z.string(),
  prefix: z.string(),
  suffix: z.string(),
  weightFormat: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  modelName: z.string(),
  isDocumentation: z.boolean(),
  fields: z.array(AnalysisFieldSchema),
  syntax: AnalysisSyntaxMetadataSchema,
});

export type AnalysisField = z.infer<typeof AnalysisFieldSchema>;
export type AnalysisSyntaxMetadata = z.infer<typeof AnalysisSyntaxMetadataSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

