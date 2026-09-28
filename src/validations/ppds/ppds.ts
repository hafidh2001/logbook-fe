import { z } from "zod";

export const ppdsSchema = z
  .object({
    display_name: z.string().min(1, "Display Name harus diisi"),
    username: z.string().min(1, "Username harus diisi"),
    email: z
      .string()
      .min(1, "Email harus diisi")
      .email("Format email tidak valid"),
    phone: z.string().min(1, "Phone harus diisi"),
    address: z.string().optional().nullable(),
    date_of_birth: z.date().optional().nullable(),
    nim: z.string().optional().nullable(),
    role_name: z.string().optional().nullable(),
    stase_name: z.string().optional().nullable(),
    total_logbook: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    old_status: z.string().optional().nullable(),
    inactive_at: z.date().optional().nullable(),
    inactive_notes: z.string().optional().nullable(),
    reactivate_date: z.date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.old_status !== data.status &&
      data.status?.toUpperCase() !== "ACTIVE" &&
      !data.inactive_at
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inactive_at"],
        message: "Inactive At harus diisi jika status DEACTIVE",
      });
    }

    if (
      data.old_status !== data.status &&
      data.status?.toUpperCase() === "ACTIVE"
    ) {
      if (data.inactive_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inactive_at"],
          message: "Inactive At harus kosong jika status ACTIVE",
        });
      }

      if (!data.reactivate_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reactivate_date"],
          message: "Reactivate Date harus diisi jika status ACTIVE",
        });
      }
    }
  });

export type TPpdsSchema = z.infer<typeof ppdsSchema>;

// Schema for PPDS create form
export const ppdsCreateSchema = z
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
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(5, "Password minimal 5 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type PpdsCreateFormData = z.infer<typeof ppdsCreateSchema>;

// Schema for change password form
export const ppdsChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(5, "Password minimal 5 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi Password harus diisi"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type PpdsChangePasswordFormData = z.infer<
  typeof ppdsChangePasswordSchema
>;
