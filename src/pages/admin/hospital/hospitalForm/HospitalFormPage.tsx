import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { icons } from "@/assets/images/Icon";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { showToast } from "@/utils/toast";
import { ConfirmationModal } from "@/components/confirmationModal";
import useModal from "@/hooks/useModal";
import { useHospitalStore } from "@/store/hospitalStore";
import {
  HospitalFormData,
  hospitalSchema,
} from "@/validations/hospital/hospital";

export default function HospitalFormPage() {
  const { idHospital } = useParams<{ idHospital: string }>();
  const navigate = useNavigate();

  const {
    selectedHospital,
    isLoading,
    loadHospitalDetail,
    createHospital,
    updateHospital,
    deleteHospital,
    resetDetail,
  } = useHospitalStore();

  const { user } = useAuthStore();

  // Load detail when in edit mode
  useEffect(() => {
    if (idHospital) {
      loadHospitalDetail(Number(idHospital));
    }
    return () => resetDetail();
  }, [idHospital, loadHospitalDetail, resetDetail]);

  const isEditMode = !!idHospital;

  const handleDelete = async () => {
    if (idHospital) {
      const success = await deleteHospital(Number(idHospital));
      if (success) {
        const successMessage = useHospitalStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        navigate(ROUTES.hospital);
      } else {
        const errorMessage = useHospitalStore.getState().error;
        showToast(errorMessage ?? "Gagal menghapus data", "error", {
          duration: 4000,
        });
      }
    }
    toggleDelete(false);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      notes: "",
    },
  });

  // Set initial values when selectedHospital is loaded in edit mode
  useEffect(() => {
    if (selectedHospital && isEditMode) {
      reset({
        name: selectedHospital.name ?? "",
        code: selectedHospital.code ?? "",
        address: selectedHospital.address ?? "",
        notes: selectedHospital.notes ?? "",
      });
    }
  }, [selectedHospital, isEditMode, reset]);

  const onSubmit = async (data: HospitalFormData) => {
    if (!data.name || !data.code) {
      return;
    }

    const payload = {
      name: data.name,
      code: data.code,
      address: data.address ?? "",
      notes: data.notes ?? "",
      id_client: user?.id_client ?? 0,
    };

    let success = false;
    if (isEditMode && idHospital) {
      console.log("Updating hospital with payload:", {
        ...payload,
        updated_by: user?.id ?? 0,
        id: Number(idHospital),
      });
      success = await updateHospital({
        ...payload,
        updated_by: user?.id ?? 0,
        id: Number(idHospital),
      });
    } else {
      console.log("Creating hospital with payload:", payload);
      success = await createHospital({ ...payload, created_by: user?.id ?? 0 });
    }

    if (success) {
      const successMessage = useHospitalStore.getState().success;
      showToast(successMessage ?? "Data berhasil disimpan!", "success");
      navigate(ROUTES.hospital);
    } else {
      const errorMessage = useHospitalStore.getState().error;
      showToast(errorMessage ?? "Data gagal disimpan!", "error", {
        duration: 4000,
      });
    }
  };

  // Delete modal
  const { isShown: isShowDelete, toggle: toggleDelete } = useModal();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Rumah Sakit", to: ROUTES.hospital },
          { label: isEditMode ? "Detail" : "Tambah Rumah Sakit" },
        ]}
        onSave={handleSubmit(onSubmit)}
        onDelete={isEditMode ? () => toggleDelete(true) : undefined}
        isLoading={isLoading}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Form - 2 Column Layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Row 1: User* | Stase* */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Name"
                    required
                    errorMessage={errors.name?.message}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan nama..."
                  />
                )}
              />
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Code"
                    required
                    errorMessage={errors.code?.message}
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan kode..."
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

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Notes"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan catatan..."
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isShown={isShowDelete}
        toggle={toggleDelete}
        title="Hapus Stase"
        description="Apakah Anda yakin ingin menghapus data stase ini? Data yang dihapus tidak dapat dikembalikan."
        onConfirm={handleDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmVariant="destructive"
        cancelVariant="outline"
      />
    </div>
  );
}
