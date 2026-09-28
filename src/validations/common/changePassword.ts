import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(5, "Password minimal 5 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
