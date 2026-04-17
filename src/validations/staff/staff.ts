import { z } from "zod";

export const staffSchema = z.object({
  displayName: z.string().min(1, "Display Name harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  phone: z.string().min(1, "Phone harus diisi"),
  dateOfBirth: z.date().optional().nullable(),
  code: z.string().optional(),
  address: z.string().optional(),
  role: z.string(),
  logbookCount: z.string(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
