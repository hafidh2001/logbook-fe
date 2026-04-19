import { Topbar } from "@/components/layout/Topbar";
import { LoadingPage } from "@/components/layout/Loading";
import { ROUTES } from "@/utils/routes";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import dayjs from "dayjs";
import { staffSchema, StaffFormData } from "@/validations/staff/staff";
import { useStaffStore } from "@/store/staffStore";
import { useEffect } from "react";

export default function StaffDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const { selectedStaff, isLoadingDetail, loadStaffDetail, updateStaff, deleteStaff, resetDetail } = useStaffStore();

  useEffect(() => {
    if (idUser) {
      loadStaffDetail(idUser);
    }
    return () => resetDetail();
  }, [idUser, loadStaffDetail, resetDetail]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      displayName: selectedStaff?.display_name || "",
      username: selectedStaff?.username || "",
      email: selectedStaff?.email || "",
      phone: selectedStaff?.phone || "",
      dateOfBirth: selectedStaff?.date_of_birth ? dayjs(selectedStaff.date_of_birth, "DD MMMM YYYY").toDate() : null,
      code: selectedStaff?.code || "",
      address: selectedStaff?.address || "",
      role: selectedStaff?.role || "staff",
      logbookCount: selectedStaff?.logbook_status || "0",
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    if (idUser) {
      await updateStaff(idUser, data);
    }
  };

  const handleDelete = async () => {
    if (idUser) {
      await deleteStaff(idUser);
      navigate(ROUTES.staff);
    }
  };

  return isLoadingDetail ? (
    <LoadingPage />
  ) : (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[114px] lg:pt-0">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
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

              {/* Row 5: Role (disabled) | Logbook (read-only + button) */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Role"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled
                    placeholder="Role..."
                  />
                )}
              />
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Controller
                    name="logbookCount"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Logbook"
                        {...field}
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled
                        placeholder="Jumlah logbook..."
                      />
                    )}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(ROUTES.staffLogbook(String(idUser)))}
                  className="flex-shrink-0 mb-0.5"
                >
                  Detail
                  <icons.ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
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
