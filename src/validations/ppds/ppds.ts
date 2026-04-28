import { z } from "zod";

export const ppdsSchema = z.object({
  display_name: z.string().min(1, "Display Name harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  phone: z.string().min(1, "Phone harus diisi"),
  address: z.string().optional().nullable(),
  date_of_birth: z.date().optional().nullable(),
  nim: z.string().optional().nullable(),
  role_name: z.string().optional().nullable(),
  stase_name: z.string().optional().nullable(),
  total_logbook: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  inactive_at: z.date().optional().nullable(),
  inactive_notes: z.string().optional().nullable(),
  reactivate_date: z.date().optional().nullable(),
});

export type TPpdsSchema = z.infer<typeof ppdsSchema>;

// Schema for PPDS create form
export const ppdsCreateSchema = z
  .object({
    displayName: z.string().min(1, "Display Name harus diisi"),
    username: z.string().min(1, "Username harus diisi"),
    phone: z.string().min(1, "Phone harus diisi"),
    email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
    nim: z.string().optional(),
    dateOfBirth: z.date().optional().nullable(),
    address: z.string().optional(),
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type PpdsCreateFormData = z.infer<typeof ppdsCreateSchema>;

// Schema for change password form
export const ppdsChangePasswordSchema = z
  .object({
    password: z.string().min(1, "Password harus diisi").min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type PpdsChangePasswordFormData = z.infer<typeof ppdsChangePasswordSchema>;
