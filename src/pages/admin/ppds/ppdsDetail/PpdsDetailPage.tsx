import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { SingleSelect } from "@/components/fields/singleSelect";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import { showToast } from "@/utils/toast";
import { ConfirmationModal } from "@/components/confirmationModal";
import useModal from "@/hooks/useModal";
import { ppdsSchema, TPpdsSchema } from "@/validations/ppds/ppds";
import { usePpdsStore } from "@/store/ppdsStore";
import { useMasterStore } from "@/store/masterStore";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function PpdsDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;

  const {
    selectedPpds,
    isLoadingDetail,
    isLoading,
    loadPpdsDetail,
    updatePpds,
    deletePpds,
    reset,
  } = usePpdsStore();

  const { statusOptions, fetchStatusOptions } = useMasterStore();

  const { isShown: isShowDelete, toggle: toggleDelete } = useModal();

  useEffect(() => {
    fetchStatusOptions();
  }, [fetchStatusOptions]);

  useEffect(() => {
    if (idUser) {
      loadPpdsDetail(Number(idUser));
    }
    return () => reset();
  }, [idUser, loadPpdsDetail, reset]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<TPpdsSchema>({
    resolver: zodResolver(ppdsSchema),
  });

  useEffect(() => {
    if (selectedPpds) {
      resetForm({
        display_name: selectedPpds.display_name ?? "",
        username: selectedPpds.username ?? "",
        email: selectedPpds.email ?? "",
        phone: selectedPpds.phone ?? "",
        address: selectedPpds.address ?? "",
        date_of_birth: selectedPpds.date_of_birth
          ? dayjs(selectedPpds.date_of_birth).toDate()
          : null,
        nim: selectedPpds.nim ?? "",
        role_name: selectedPpds.role_name ?? "",
        stase_name: selectedPpds.stase_name ?? "",
        total_logbook: selectedPpds.total_logbook
          ? `${selectedPpds.total_logbook} items`
          : "0",
        status: selectedPpds.status ?? "",
        inactive_at: selectedPpds.inactive_at
          ? dayjs(selectedPpds.inactive_at).toDate()
          : null,
        inactive_notes: selectedPpds.inactive_notes ?? "",
        reactivate_date: selectedPpds.reactivate_date
          ? dayjs(selectedPpds.reactivate_date).toDate()
          : null,
      });
    }
  }, [selectedPpds, resetForm]);

  const onSubmit = async (data: TPpdsSchema) => {
    if (idUser) {
      // Transform form data to API payload (Date -> string)
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth
          ? dayjs(data.date_of_birth).format("YYYY-MM-DD")
          : null,
        inactive_at: data.inactive_at
          ? dayjs(data.inactive_at).format("YYYY-MM-DD")
          : null,
      };
      const success = await updatePpds({ id_user: Number(idUser), ...payload });
      if (success) {
        showToast("Data berhasil diperbarui", "success");
        navigate(ppdsListRoute);
      } else {
        const errorMessage = usePpdsStore.getState().error;
        showToast(errorMessage ?? "Data gagal diperbarui!", "error", {
          duration: 4000,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (idUser) {
      const success = await deletePpds(Number(idUser));
      if (success) {
        const successMessage = usePpdsStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        navigate(ppdsListRoute);
      } else {
        const errorMessage = usePpdsStore.getState().error;
        showToast(errorMessage ?? "Gagal menghapus data", "error", {
          duration: 4000,
        });
      }
    }
    toggleDelete(false);
  };

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  return (
    <div className="min- h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: isInactive ? "PPDS Nonaktif" : "PPDS", to: ppdsListRoute },
          { label: "Detail", to: undefined },
        ]}
        onSave={handleSubmit(onSubmit)}
        onDelete={() => toggleDelete(true)}
        isLoading={isLoading}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Edit Form - 2 Column Layout */}
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
                    value={field.value ?? ""}
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
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Masukkan username..."
                  />
                )}
              />

              {/* Row 2: Phone* | Email* */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Phone"
                    required
                    errorMessage={errors.phone?.message}
                    {...field}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Masukkan nomor telepon..."
                  />
                )}
              />
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
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Masukkan email..."
                  />
                )}
              />

              {/* Row 3: NIM | Date Of Birth */}
              <Controller
                name="nim"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="NIM"
                    {...field}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Masukkan NIM..."
                  />
                )}
              />
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

              {/* Row 4: Address (full width) */}
              <div className="sm:col-span-2">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Address"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Masukkan alamat..."
                    />
                  )}
                />
              </div>

              {/* Row 5: Stase (disabled) | Role (disabled) */}
              <div className="flex flex-col gap-1">
                <Controller
                  name="stase_name"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Stase"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Stase PPDS..."
                      disabled
                    />
                  )}
                />
                <span className="text-xs text-gray-500 -mt-1">
                  Stase PPDS ditambahkan pada menu Stase
                </span>
              </div>
              <Controller
                name="role_name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Role"
                    {...field}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Role..."
                    disabled
                  />
                )}
              />

              {/* Row 6: Status* | Inactive At */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Status<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      errorMessage={errors.status?.message}
                      options={statusOptions}
                      value={
                        statusOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as string)
                      }
                      isSearchable={false}
                      isClearable={false}
                    />
                  </div>
                )}
              />
              <Controller
                name="inactive_at"
                control={control}
                render={({ field }) => (
                  <CalendarSelect
                    label="Inactive At"
                    {...field}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Pilih tanggal inactive..."
                  />
                )}
              />

              {/* Row 7: Inactive Notes | Reactivate Date (disabled) */}
              <Controller
                name="inactive_notes"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Inactive Notes"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan catatan inactive..."
                  />
                )}
              />
              <Controller
                name="reactivate_date"
                control={control}
                render={({ field }) => (
                  <CalendarSelect
                    label="Reactivate Date"
                    {...field}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Tanggal reactivate akan muncul setelah dinonaktifkan..."
                    isDisabled
                  />
                )}
              />

              {/* Row 8: Logbook (full width, read-only + button) */}
              <div className="sm:col-span-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Controller
                      name="total_logbook"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          label="Logbook"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Jumlah logbook..."
                          disabled
                        />
                      )}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(
                        isInactive
                          ? ROUTES.ppdsInactiveLogbook(String(idUser))
                          : ROUTES.ppdsLogbook(String(idUser)),
                      )
                    }
                    className="flex-shrink-0 mb-0.5"
                  >
                    Detail
                    <icons.ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
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

      <ConfirmationModal
        isShown={isShowDelete}
        toggle={toggleDelete}
        title="Hapus Data"
        description={
          <>
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-semibold">
              {selectedPpds?.display_name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
        onConfirm={handleDelete}
        confirmText="Hapus"
        cancelText="Batal"
        confirmVariant="destructive"
        cancelVariant="outline"
      />
    </div>
  );
}
