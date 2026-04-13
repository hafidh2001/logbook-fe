import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "@/components/fields/inputField";
import { CalendarSelect } from "@/components/fields/calendarSelect";
import { SingleSelect } from "@/components/fields/singleSelect";
import { Button } from "@/components/ui/button";
import { icons } from "@/assets/images/Icon";
import type { BasicSelectOpt } from "@/types";

// Schema for PPDS edit form
const ppdsSchema = z.object({
  displayName: z.string().min(1, "Display Name harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  phone: z.string().min(1, "Phone harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Format email tidak valid"),
  nim: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  address: z.string().optional(),
  status: z.string().min(1, "Status harus dipilih"),
  inactiveAt: z.date().optional().nullable(),
  inactiveNotes: z.string().optional(),
});

type PpdsFormData = z.infer<typeof ppdsSchema>;

// Status options
const statusOptions: BasicSelectOpt<string>[] = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

// Mock data - in real app this would come from API
const mockPpdsData = {
  displayName: "Ujang",
  username: "ujangzhafran",
  phone: "088",
  email: "ujang@email.c",
  nim: "7777",
  dateOfBirth: new Date("2005-02-09"),
  address: "Blora",
  stage: "Stase Rekon I",
  role: "ppds",
  status: "aktif",
  inactiveAt: null as Date | null,
  inactiveNotes: "",
  reactivateDate: null as Date | null,
  logbook: 28,
};

export default function PpdsDetailPage() {
  const { idUser } = useParams<{ idUser: string }>();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PpdsFormData>({
    resolver: zodResolver(ppdsSchema),
    defaultValues: {
      displayName: mockPpdsData.displayName,
      username: mockPpdsData.username,
      phone: mockPpdsData.phone,
      email: mockPpdsData.email,
      nim: mockPpdsData.nim,
      dateOfBirth: mockPpdsData.dateOfBirth,
      address: mockPpdsData.address,
      status: mockPpdsData.status,
      inactiveAt: mockPpdsData.inactiveAt,
      inactiveNotes: mockPpdsData.inactiveNotes,
    },
  });

  const onSubmit = (data: PpdsFormData) => {
    console.log("Saving PPDS:", { idUser, ...data });
    // TODO: Call API to save
  };

  const handleDelete = () => {
    // TODO: Implement delete
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar
        breadcrumbs={[
          { label: "PPDS", to: ROUTES.ppds },
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
                  value={mockPpdsData.stage}
                  disabled
                  placeholder="Stase PPDS..."
                />
                <span className="text-xs text-gray-500 -mt-1">
                  Stase PPDS ditambahkan pada menu Stase
                </span>
              </div>
              <InputField
                label="Role"
                value={mockPpdsData.role}
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
                      value={String(mockPpdsData.logbook)}
                      disabled
                      placeholder="Jumlah logbook..."
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(ROUTES.ppdsLogbook(String(idUser)))}
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
