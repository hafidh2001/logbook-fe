import { z } from "zod";

export const hospitalSchema = z.object({
  name: z.string().min(1, "Name harus diisi"),
  code: z.string().min(1, "Code harus diisi"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;