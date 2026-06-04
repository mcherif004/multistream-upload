import { z } from "zod";

const globalConfigSchema = z.object({
  title: z.string().trim().min(1, "El título global es obligatorio").max(120),
});

const mediaSchema = z.object({
  name: z.string().trim().min(1, "Nombre de archivo inválido"),
  type: z.string().trim().min(1, "Tipo de archivo inválido"),
  size: z.number().min(1, "Archivo vacío"),
  previewUrl: z.string().url("Preview URL inválida"),
  file: z.instanceof(File, { message: "Archivo de video inválido" }),
});

const platformConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
});

export const uploadSchema = z.object({
  media: mediaSchema.optional(),
  global: globalConfigSchema,
  youtube: platformConfigSchema,
  tiktok: platformConfigSchema,
  instagram: platformConfigSchema,
  facebook: platformConfigSchema,
});

export type UploadFormValues = z.infer<typeof uploadSchema>;

export const defaultUploadValues: UploadFormValues = {
  media: undefined,
  global: {
    title: "",
  },
  youtube: {
    enabled: true,
    title: "",
  },
  tiktok: {
    enabled: true,
    title: "",
  },
  instagram: {
    enabled: true,
    title: "",
  },
  facebook: {
    enabled: true,
    title: "",
  },
};
