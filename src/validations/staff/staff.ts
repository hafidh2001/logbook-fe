import { z } from "zod";

export const staffSchema = z.object({
  display_name: z.string().min(1, "Display Name harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid"),
  phone: z.string().min(1, "Phone harus diisi"),
  address: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  date_of_birth: z.date().optional().nullable(),
  nim: z.string().optional().nullable(),
  id_role: z.number({ message: "Role harus dipilih" }).nullable(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

// Schema for Staff create form
export const staffCreateSchema = z
  .object({
    display_name: z.string().min(1, "Display Name harus diisi"),
    username: z.string().min(1, "Username harus diisi"),
    phone: z.string().min(1, "Phone harus diisi"),
    email: z
      .string()
      .min(1, "Email harus diisi")
      .email("Format email tidak valid"),
    nim: z.string().optional(),
    date_of_birth: z.date().optional().nullable(),
    address: z.string().optional(),
    location: z.string().optional(),
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(5, "Password minimal 5 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi Password harus diisi"),
    id_role: z.number({ message: "Role harus dipilih" }).nullable(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

export type StaffCreateFormData = z.infer<typeof staffCreateSchema>;
