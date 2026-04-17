import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { SingleSelect } from "@/components/fields/singleSelect";
import { SwitchField } from "@/components/fields/switchField";
import { icons } from "@/assets/images/Icon";
import type { BasicSelectOpt } from "@/types";
import { staseSchema, createInitialStaseValues, StaseFormData } from "@/validations/stase/stase";
import { useStaseStore } from "@/store/staseStore";
import { useEffect } from "react";
import dayjs from "dayjs";

// Options
const userOptions: BasicSelectOpt<string>[] = [
  { value: "ujang", label: "Ujang" },
  { value: "yudhistira", label: "Yudhistira" },
  { value: "fanny", label: "Fanny" },
];

const staseOptions: BasicSelectOpt<string>[] = [
  { value: "rekon_i", label: "Stase Rekon I" },
  { value: "ortho_rso_iii", label: "Ortho RSO III" },
  { value: "spine_ii", label: "Stase Spine II" },
  { value: "radiologi", label: "Radiologi" },
  { value: "anesthesi", label: "Anesthesi" },
  { value: "bedah_dasar", label: "Bedah Dasar" },
  { value: "mst_ii", label: "Stase MST II" },
  { value: "rsdm_otk", label: "RSDM OTK" },
];

const stageOptions: BasicSelectOpt<string>[] = [
  { value: "stage_1", label: "Stage 1" },
  { value: "stage_2", label: "Stage 2" },
  { value: "stage_3", label: "Stage 3" },
  { value: "stage_4", label: "Stage 4" },
];

const semesterOptions: BasicSelectOpt<string>[] = [
  { value: "semester_1", label: "Semester 1" },
  { value: "semester_2", label: "Semester 2" },
  { value: "semester_3", label: "Semester 3" },
  { value: "semester_4", label: "Semester 4" },
  { value: "semester_5", label: "Semester 5" },
  { value: "semester_6", label: "Semester 6" },
  { value: "semester_7", label: "Semester 7" },
  { value: "semester_8", label: "Semester 8" },
  { value: "semester_9", label: "Semester 9" },
  { value: "semester_10", label: "Semester 10" },
  { value: "semester_11", label: "Semester 11" },
  { value: "semester_12", label: "Semester 12" },
];

// Mock data for edit mode - in real app this would come from API
const mockStaseData = {
  user: "ujang",
  stase: "rekon_i",
  stage: "stage_1",
  semester: "semester_5",
  date: new Date("2026-01-08"),
  notes: "",
  mengulangStase: false,
};

export default function StaseFormPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const { loadStaseDetail, createStase, updateStase, deleteStase, resetDetail } = useStaseStore();

  useEffect(() => {
    if (idUser) {
      loadStaseDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadStaseDetail, resetDetail]);

  const isEditMode = !!idUser;
  const initialValues = isEditMode ? mockStaseData : createInitialStaseValues;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaseFormData>({
    resolver: zodResolver(staseSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: StaseFormData) => {
    const { date, ...rest } = data;
    const submitData = {
      ...rest,
      date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    };
    if (isEditMode && idUser) {
      await updateStase(idUser, submitData);
    } else {
      await createStase(submitData);
    }
  };

  const handleDelete = async () => {
    if (idUser) {
      await deleteStase(idUser);
      navigate(ROUTES.stase);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Stase", to: ROUTES.stase },
          { label: isEditMode ? "Detail" : "Tambah Stase", to: undefined },
        ]}
        onSave={handleSubmit(onSubmit)}
        onDelete={isEditMode ? handleDelete : undefined}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Form - 2 Column Layout */}
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Row 1: User* | Stase* */}
              <Controller
                name="user"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      User<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={userOptions}
                      value={
                        userOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as string)
                      }
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.user?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="stase"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Stase<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={staseOptions}
                      value={
                        staseOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as string)
                      }
                      isSearchable
                      isClearable={false}
                      errorMessage={errors.stase?.message}
                    />
                  </div>
                )}
              />

              {/* Row 2: Stage* | Semester* */}
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Stage<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={stageOptions}
                      value={
                        stageOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as string)
                      }
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.stage?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Semester<span className="text-red-600 ml-1">*</span>
                    </label>
                    <SingleSelect
                      {...field}
                      options={semesterOptions}
                      value={
                        semesterOptions.find(
                          (opt) => opt.value === field.value,
                        ) || null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value as string)
                      }
                      isSearchable={false}
                      isClearable={false}
                      errorMessage={errors.semester?.message}
                    />
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
                  name="mengulangStase"
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
    </div>
  );
}
