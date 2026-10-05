import { Topbar } from "@/components/layout/Topbar";
import { CardWrapper } from "@/components/card/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { icons } from "@/assets/images/Icon";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/fields/passwordField";
import { ppdsChangePasswordSchema, PpdsChangePasswordFormData } from "@/validations/ppds/ppds";
import { usePpdsStore } from "@/store/ppdsStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { showToast } from "@/utils/toast";

export default function PpdsChangePasswordPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const { selectedPpds, loadPpdsDetail, changePassword, isLoading } = usePpdsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (idUser) {
      loadPpdsDetail(Number(idUser));
    }
  }, [idUser, loadPpdsDetail]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PpdsChangePasswordFormData>({
    resolver: zodResolver(ppdsChangePasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: PpdsChangePasswordFormData) => {
    if (!idUser) return;

    const payload = {
      updated_by: user?.id ?? 0,
      id_user: Number(idUser),
      password: data.password,
      confirm_password: data.confirm_password,
    };

    const success = await changePassword(payload);
    if (success) {
      const successMessage = usePpdsStore.getState().success;
      showToast(successMessage ?? "Password berhasil diubah!", "success");
      navigate(ROUTES.ppds);
    } else {
      const errorMessage = usePpdsStore.getState().error;
      showToast(errorMessage ?? "Password gagal diubah!", "error", {
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "PPDS", to: ROUTES.ppds },
          { label: "Ubah Password" },
        ]}
        onSave={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <CardWrapper title="Profil" className="mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#EAF6EF] flex items-center justify-center">
                <icons.User className="h-11 w-11 text-[#087F5B]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedPpds?.display_name || "-"}
                </h2>
                <p className="text-sm text-gray-500">NIM: {selectedPpds?.nim || "-"}</p>
                <p className="text-sm text-gray-500 capitalize">Role: {selectedPpds?.role_name || "ppds"}</p>
              </div>
            </div>
          </CardWrapper>

          {/* Change Password Form - 2 Column Layout */}
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
                name="confirm_password"
                control={control}
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label="Konfirmasi Password"
                    placeholder="Masukkan konfirmasi password..."
                    errorMessage={errors.confirm_password?.message}
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
