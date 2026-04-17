import { z } from "zod";

export const profileEditSchema = z.object({
  displayName: z.string().min(1, "Display Name harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  code: z.string().optional(),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
