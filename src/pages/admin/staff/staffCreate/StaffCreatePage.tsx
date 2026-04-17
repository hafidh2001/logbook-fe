import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { icons } from "@/assets/images/Icon";
import { Input } from "@/components/ui/input";

// Schema for Staff create form
const staffCreateSchema = z
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

type StaffCreateFormData = z.infer<typeof staffCreateSchema>;

export default function StaffCreatePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffCreateFormData>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      phone: "",
      dateOfBirth: null,
      code: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: StaffCreateFormData) => {
    console.log("Creating Staff:", data);
    // TODO: Call API to create
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Tambah Staff" },
        ]}
        onSave={handleSubmit(onSubmit)}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Create Form - 2 Column Layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

              {/* Row 1: Display Name* | Username* */}
              <Controller
                name="displayName"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Display Name"
                    required
                    errorMessage={errors.displayName?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan nama lengkap..."
                  />
                )}
              />
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Username"
                    required
                    errorMessage={errors.username?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan username..."
                  />
                )}
              />

              {/* Row 2: Email* | Phone* */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Email"
                    required
                    type="email"
                    errorMessage={errors.email?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan email..."
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Phone"
                    required
                    errorMessage={errors.phone?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan nomor telepon..."
                  />
                )}
              />

              {/* Row 3: Date Of Birth | Code */}
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <CalendarSelect
                    label="Date Of Birth"
                    {...field}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Pilih tanggal lahir..."
                  />
                )}
              />
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Code"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan code..."
                  />
                )}
              />

              {/* Row 4: Address (full width) */}
              <div className="sm:col-span-2">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Address"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Masukkan alamat..."
                    />
                  )}
                />
              </div>

              {/* Row 5: Password* | Konfirmasi Password* */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Password<span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Masukkan password..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                      >
                        {showPassword ? (
                          <icons.EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <icons.Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Konfirmasi Password<span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Masukkan konfirmasi password..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <icons.EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <icons.Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                )}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
