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

// Schema for Staff create form
export const staffCreateSchema = z
  .object({
    displayName: z.string().min(1, "Display Name harus diisi"),
    username: z.string().min(1, "Username harus diisi"),
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
    phone: z.string().min(1, "Phone harus diisi"),
    dateOfBirth: z.date().optional().nullable(),
    code: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type StaffCreateFormData = z.infer<typeof staffCreateSchema>;
