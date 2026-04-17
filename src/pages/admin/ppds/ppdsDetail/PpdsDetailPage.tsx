import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { SingleSelect } from "@/components/fields/singleSelect";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import type { BasicSelectOpt } from "@/types";
import { ppdsSchema, PpdsFormData } from "@/validations/ppds/ppds";
import { usePpdsStore } from "@/store/ppdsStore";
import { useEffect } from "react";
import dayjs from "dayjs";

// Status options
const statusOptions: BasicSelectOpt<string>[] = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export default function PpdsDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isInactive = location.pathname.includes("/ppds-inactive/");

  const ppdsListRoute = isInactive ? ROUTES.ppdsInactive : ROUTES.ppds;

  const { selectedPpds, loadPpdsDetail, updatePpds, deletePpds, resetDetail } = usePpdsStore();

  useEffect(() => {
    if (idUser) {
      loadPpdsDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadPpdsDetail, resetDetail]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PpdsFormData>({
    resolver: zodResolver(ppdsSchema),
    defaultValues: {
      displayName: selectedPpds?.displayName || "",
      username: selectedPpds?.username || "",
      phone: selectedPpds?.phone || "",
      email: selectedPpds?.email || "",
      nim: selectedPpds?.nim || "",
      dateOfBirth: selectedPpds?.dateOfBirth ? dayjs(selectedPpds.dateOfBirth).toDate() : null,
      address: selectedPpds?.address || "",
      status: "aktif",
      inactiveAt: null,
      inactiveNotes: "",
    },
  });

  const onSubmit = async (data: PpdsFormData) => {
    if (idUser) {
      const { dateOfBirth, inactiveAt, ...rest } = data;
      const updateData = {
        ...rest,
        dateOfBirth: dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : undefined,
        inactiveAt: inactiveAt ? dayjs(inactiveAt).format("YYYY-MM-DD") : undefined,
      };
      await updatePpds(idUser, updateData);
    }
  };

  const handleDelete = async () => {
    if (idUser) {
      await deletePpds(idUser);
      navigate(ppdsListRoute);
    }
  };

  return (
    <div className="min- h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: isInactive ? "PPDS Nonaktif" : "PPDS", to: ppdsListRoute },
          { label: "Detail", to: undefined },
        ]}
        onSave={handleSubmit(onSubmit)}
        onDelete={handleDelete}
      />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Edit Form - 2 Column Layout */}
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
                    value={field.value || ""}
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
                    value={field.value || ""}
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
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Masukkan NIM..."
                  />
                )}
              />
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

              {/* Row 5: Stase (disabled) | Role (disabled) */}
              <div className="flex flex-col gap-1">
                <InputField
                  label="Stase"
                  value={selectedPpds?.stage || "-"}
                  disabled
                  placeholder="Stase PPDS..."
                />
                <span className="text-xs text-gray-500 -mt-1">
                  Stase PPDS ditambahkan pada menu Stase
                </span>
              </div>
              <InputField
                label="Role"
                value={selectedPpds?.role || "ppds"}
                disabled
                placeholder="Role..."
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
                      value={statusOptions.find(opt => opt.value === field.value) || null}
                      onChange={(option) => field.onChange(option?.value as string)}
                      isSearchable={false}
                      isClearable={false}
                    />
                  </div>
                )}
              />
              <Controller
                name="inactiveAt"
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
                name="inactiveNotes"
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
              <InputField
                label="Reactivate Date"
                value=""
                disabled
                placeholder="Tanggal reactivate akan muncul setelah dinonaktifkan..."
              />

              {/* Row 8: Logbook (full width, read-only + button) */}
              <div className="sm:col-span-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InputField
                      label="Logbook"
                      value={String(selectedPpds?.logbook || 0)}
                      disabled
                      placeholder="Jumlah logbook..."
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(isInactive ? ROUTES.ppdsInactiveLogbook(String(idUser)) : ROUTES.ppdsLogbook(String(idUser)))}
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
    </div>
  );
}
