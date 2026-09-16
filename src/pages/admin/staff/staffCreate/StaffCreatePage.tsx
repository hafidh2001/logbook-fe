import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { icons } from "@/assets/images/Icon";
import { Input } from "@/components/ui/input";
import { useStaffStore } from "@/store/staffStore";
import { useAuthStore } from "@/store/authStore";
import {
  staffCreateSchema,
  StaffCreateFormData,
} from "@/validations/staff/staff";
import { showToast } from "@/utils/toast";
import dayjs from "dayjs";

export default function StaffCreatePage() {
  const navigate = useNavigate();
  const { createStaff } = useStaffStore();
  const { user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffCreateFormData>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: {
      display_name: "",
      username: "",
      email: "",
      phone: "",
      date_of_birth: null,
      nim: "",
      address: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: StaffCreateFormData) => {
    const payload = {
      ...data,
      date_of_birth: data.date_of_birth
        ? dayjs(data.date_of_birth).format("YYYY-MM-DD")
        : null,
      id_client: user?.id_client ?? 0,
      created_by: user?.id ?? 0,
    };

    const success = await createStaff(payload);
    if (success) {
      const successMessage = useStaffStore.getState().success;
      showToast(successMessage ?? "Data berhasil dibuat!", "success");
      navigate(ROUTES.staff);
    } else {
      const errorMessage = useStaffStore.getState().error;
      showToast(errorMessage ?? "Data gagal dibuat!", "error", {
        duration: 4000,
      });
    }
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
                name="display_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Display Name"
                    required
                    errorMessage={errors.display_name?.message}
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

              {/* Row 3: Date Of Birth | NIM */}
              <Controller
                name="date_of_birth"
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
                name="nim"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="NIP"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan NIP..."
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
                      <p className="text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="confirm_password"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Konfirmasi Password
                      <span className="text-red-600 ml-1">*</span>
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <icons.EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <icons.Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="text-sm text-red-600">
                        {errors.confirm_password?.message}
                      </p>
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
