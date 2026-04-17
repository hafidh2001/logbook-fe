import { Topbar } from "@/components/ui/Topbar";
import { CardWrapper } from "@/components/ui/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { icons } from "@/assets/images/Icon";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/fields/passwordField";
import { changePasswordSchema, ChangePasswordFormData } from "@/validations/common/changePassword";

// Mock data - in real app this would come from API
const mockStaffData = {
  displayName: "Dokter Indah",
  nim: "-",
  role: "staff",
};

export default function StaffChangePasswordPage() {
  const { idUser } = useParams<{ idUser: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    console.log("Changing password for user:", idUser, data);
    // TODO: Call API to change password
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(":idUser") },
          { label: "Ubah Password", to: ROUTES.staffChangePassword(":idUser") },
        ]}
        onSave={handleSubmit(onSubmit)}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <CardWrapper title="Profil" className="mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <icons.User className="h-11 w-11 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {mockStaffData.displayName}
                </h2>
                <p className="text-sm text-gray-500">
                  NIM: {mockStaffData.nim}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Role: {mockStaffData.role}
                </p>
              </div>
            </div>
          </CardWrapper>

          {/* change Password Form - 2 Column Layout */}
          <CardWrapper title="Ubah Password" className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Row 1: Password* | Confirm Password* */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label="Password"
                    placeholder="Masukkan password baru..."
                    errorMessage={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label="Konfirmasi Password"
                    placeholder="Masukkan konfirmasi password..."
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />
            </div>
          </CardWrapper>

          {/* Back Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
            >
              <icons.ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
