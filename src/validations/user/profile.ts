import { z } from "zod";

export const profileEditSchema = z.object({
  display_name: z.string().min(1, "Display Name harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  date_of_birth: z.date().optional().nullable(),
  code: z.string().optional().nullable(),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
