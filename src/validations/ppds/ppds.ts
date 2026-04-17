import { z } from "zod";

export const ppdsSchema = z.object({
  displayName: z.string().min(1, "Display Name harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  phone: z.string().min(1, "Phone harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  nim: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  address: z.string().optional(),
  status: z.string().min(1, "Status harus dipilih"),
  inactiveAt: z.date().optional().nullable(),
  inactiveNotes: z.string().optional(),
});

export type PpdsFormData = z.infer<typeof ppdsSchema>;

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
