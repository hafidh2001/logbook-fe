import dayjs from "dayjs";
import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { icons } from "@/assets/images/Icon";
import {
  profileEditSchema,
  ProfileEditFormData,
} from "@/validations/user/profile";
import { useAuthStore } from "@/store/authStore";
import { showToast } from "@/utils/toast";
import { useEffect } from "react";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
  });

  useEffect(() => {
    if (user) {
      resetForm({
        display_name: user?.display_name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        address: user?.address ?? "",
        date_of_birth: user?.date_of_birth
          ? new Date(user.date_of_birth)
          : null,
        code: user?.code ?? "",
      });
    }
  }, [resetForm]);

  const onSubmit = async (data: ProfileEditFormData) => {
    const payload = {
      ...data,
      date_of_birth: data.date_of_birth
        ? dayjs(data.date_of_birth).format("YYYY-MM-DD")
        : null,
    };

    const success = await updateProfile({ ...payload, id_user: user?.id ?? 0 });

    if (success) {
      const successMessage = useAuthStore.getState().success;
      showToast(successMessage ?? "Data berhasil diupdate!", "success", {
        duration: 3000,
      });
      navigate(ROUTES.profile);
    } else {
      const errorMessage = useAuthStore.getState().error;
      showToast(errorMessage ?? "Data gagal diupdate!", "error", {
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Profil", to: ROUTES.profile },
          { label: "Edit Profil" },
        ]}
        onSave={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Edit Profile Form - 2 Column Layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Row 1: Display Name* | Email */}
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
                name="email"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Email"
                    type="email"
                    errorMessage={errors.email?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan email..."
                  />
                )}
              />

              {/* Row 2: Phone | Address */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Phone"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan nomor telepon..."
                  />
                )}
              />
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

              {/* Row 3: Date Of Birth | Code */}
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
                name="code"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="NIM"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan NIM..."
                  />
                )}
              />
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <icons.ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
