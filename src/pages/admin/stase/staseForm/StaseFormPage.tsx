import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { SingleSelect } from "@/components/fields/singleSelect";
import { SwitchField } from "@/components/fields/switchField";
import { icons } from "@/assets/images/Icon";
import type { BasicSelectOpt } from "@/types";
import {
  staseSchema,
  createInitialStaseValues,
  StaseFormData,
} from "@/validations/stase/stase";
import { useStaseStore } from "@/store/staseStore";
import { useMasterStore } from "@/store/masterStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { showToast } from "@/utils/toast";
import { ConfirmationModal } from "@/components/confirmationModal";
import useModal from "@/hooks/useModal";

export default function StaseFormPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const idLogbook = idUser;
  const navigate = useNavigate();

  const {
    selectedStase,
    isLoading,
    loadStaseDetail,
    createStase,
    updateStase,
    deleteStase,
    resetDetail,
  } = useStaseStore();

  const {
    ppdsActiveOptions,
    staseOptions,
    stageOptions,
    semesterOptions,
    fetchPPDSActiveOptions,
    fetchStaseOptions,
    fetchStageByStase,
    fetchSemesterOptions,
  } = useMasterStore();

  const { user } = useAuthStore();

  // Guard to prevent cascading effects during initial form population in edit mode
  const [isFormInitialized, setIsFormInitialized] = useState(true);

  // Initial load
  useEffect(() => {
    if (user?.id_client) {
      fetchPPDSActiveOptions({ id_client: user.id_client });
      fetchStaseOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchPPDSActiveOptions, fetchStaseOptions]);

  // Load detail when in edit mode
  useEffect(() => {
    if (idLogbook) {
      loadStaseDetail(Number(idLogbook));
    }
    return () => resetDetail();
  }, [idLogbook, loadStaseDetail, resetDetail]);

  const isEditMode = !!idLogbook;

  const handleDelete = async () => {
    if (idLogbook) {
      const success = await deleteStase(Number(idLogbook));
      if (success) {
        const successMessage = useStaseStore.getState().success;
        showToast(successMessage ?? "Data berhasil dihapus!", "success", {
          duration: 3000,
        });
        navigate(ROUTES.stase);
      } else {
        const errorMessage = useStaseStore.getState().error;
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
    setValue,
    formState: { errors },
  } = useForm<StaseFormData>({
    resolver: zodResolver(staseSchema),
    defaultValues: createInitialStaseValues,
  });

  // Watch stase and stage values for cascading
  const watchedIdStase = useWatch({ control, name: "id_stase" });
  const watchedIdStage = useWatch({ control, name: "id_stage" });

  // When stase changes, fetch stage by stase and populate dropdown
  useEffect(() => {
    if (isFormInitialized && watchedIdStase) {
      fetchStageByStase({ id_stase: Number(watchedIdStase) });
    }
  }, [isFormInitialized, watchedIdStase, fetchStageByStase]);

  // When stage changes, fetch semesters
  useEffect(() => {
    if (watchedIdStage) {
      fetchSemesterOptions({ id_stage: Number(watchedIdStage) });
    }
  }, [watchedIdStage, fetchSemesterOptions]);

  // Set initial values when selectedStase is loaded in edit mode
  useEffect(() => {
    if (selectedStase && isEditMode) {
      setIsFormInitialized(false);
      reset({
        id_user: selectedStase.id_user,
        id_stase: selectedStase.id_stase,
        id_stage: selectedStase.id_stage,
        id_semester: selectedStase.id_semester,
        date: selectedStase.date ? new Date(selectedStase.date) : undefined,
        notes: selectedStase.notes ?? "",
        is_retake: selectedStase.is_retake ?? false,
      });
      // Load stage for the stase
      if (selectedStase.id_stase) {
        fetchStageByStase({ id_stase: selectedStase.id_stase });
      }
      // Load semesters for the initial stage
      if (selectedStase.id_stage) {
        fetchSemesterOptions({ id_stage: selectedStase.id_stage });
      }
      // Mark form as initialized after reset
      setIsFormInitialized(true);
    }
  }, [
    selectedStase,
    isEditMode,
    reset,
    fetchStageByStase,
    fetchSemesterOptions,
  ]);

  const onSubmit = async (data: StaseFormData) => {
    if (!data.id_user || !data.id_stase || !data.id_semester || !data.date) {
      return;
    }

    const payload = {
      id_user: data.id_user,
      id_stase: data.id_stase,
      id_semester: data.id_semester,
      date: dayjs(data.date).format("YYYY-MM-DD"),
      id_client: user?.id_client ?? 0,
      notes: data.notes ?? "",
      is_retake: data.is_retake,
    };

    let success = false;
    if (isEditMode && idLogbook) {
      success = await updateStase({
        ...payload,
        updated_by: user?.id ?? 0,
        id_logbook: Number(idLogbook),
      });
    } else {
      success = await createStase({ ...payload, created_by: user?.id ?? 0 });
    }

    if (success) {
      const successMessage = useStaseStore.getState().success;
      showToast(successMessage ?? "Data berhasil disimpan!", "success");
      navigate(ROUTES.stase);
    } else {
      const errorMessage = useStaseStore.getState().error;
      showToast(errorMessage ?? "Data gagal disimpan!", "error", {
        duration: 4000,
      });
    }
  };

  // Delete modal
  const { isShown: isShowDelete, toggle: toggleDelete } = useModal();

  // Convert options helper
  const ppdsSelectOptions: BasicSelectOpt<number>[] = ppdsActiveOptions.map(
    (opt) => ({
      value: Number(opt.value),
      label: opt.label,
    }),
  );

  const staseSelectOptions: BasicSelectOpt<number>[] = staseOptions.map(
    (opt) => ({
      value: Number(opt.value),
      label: opt.label,
    }),
  );

  const stageSelectOptions: BasicSelectOpt<number>[] = stageOptions.map(
    (opt) => ({
      value: Number(opt.value),
      label: opt.label,
    }),
  );

  const semesterSelectOptions: BasicSelectOpt<number>[] = semesterOptions.map(
    (opt) => ({
      value: Number(opt.value),
      label: opt.label,
    }),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Stase", to: ROUTES.stase },
          { label: isEditMode ? "Detail" : "Tambah Stase" },
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
                name="id_user"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      User<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={ppdsSelectOptions}
                      value={
                        ppdsSelectOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as number)
                      }
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.id_user?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="id_stase"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Stase<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={staseSelectOptions}
                      value={
                        staseSelectOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as number)
                      }
                      isSearchable
                      isClearable={false}
                      errorMessage={errors.id_stase?.message}
                    />
                  </div>
                )}
              />

              {/* Row 2: Stage* | Semester* */}
              <Controller
                name="id_stage"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Stage<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={stageSelectOptions}
                      value={
                        stageSelectOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) => {
                        field.onChange(option?.value as number);
                        // Reset semester when stage changes
                        setValue("id_semester", null);
                      }}
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.id_stage?.message}
                    />
                    <span className="text-xs text-gray-500">
                      Pilih stase terlebih dahulu
                    </span>
                  </div>
                )}
              />
              <Controller
                name="id_semester"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Semester<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={semesterSelectOptions}
                      value={
                        semesterSelectOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as number)
                      }
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.id_semester?.message}
                    />
                    <span className="text-xs text-gray-500">
                      Pilih stage terlebih dahulu
                    </span>
                  </div>
                )}
              />

              {/* Row 3: Date* | Notes */}
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CalendarSelect
                    label="Date"
                    {...field}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Pilih tanggal..."
                    errorMessage={errors.date?.message}
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

              {/* Row 4: Mengulang Stase (full width) */}
              <div className="sm:col-span-2">
                <Controller
                  name="is_retake"
                  control={control}
                  render={({ field }) => (
                    <SwitchField
                      checked={field.value}
                      onChange={field.onChange}
                      label="Mengulang Stase"
                    />
                  )}
                />
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
