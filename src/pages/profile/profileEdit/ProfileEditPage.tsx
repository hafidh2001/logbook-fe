import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { icons } from "@/assets/images/Icon";
import { profileEditSchema, ProfileEditFormData } from "@/validations/user/profile";

// Mock data - in real app this would come from API
const mockProfileData = {
  displayName: "DIANTI INSTITUSI",
  email: "dianti@email.com",
  phone: "08123456789",
  address: "Jakarta, Indonesia",
  dateOfBirth: null as Date | null,
  code: "DIANTI001",
};

export default function ProfileEditPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      displayName: mockProfileData.displayName,
      email: mockProfileData.email,
      phone: mockProfileData.phone,
      address: mockProfileData.address,
      dateOfBirth: mockProfileData.dateOfBirth,
      code: mockProfileData.code,
    },
  });

  const onSubmit = (data: ProfileEditFormData) => {
    console.log("Saving profile:", data);
    // TODO: Call API to save
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Profil", to: ROUTES.profile },
          { label: "Edit Profil" },
        ]}
        onSave={handleSubmit(onSubmit)}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Edit Profile Form - 2 Column Layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                {/* Row 1: Display Name* | Email */}
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
