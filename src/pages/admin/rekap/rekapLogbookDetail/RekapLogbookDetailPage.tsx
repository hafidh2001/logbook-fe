import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function RekapLogbookDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Logbook", to: ROUTES.rekapLogbook },
          { label: "Detail", to: ROUTES.rekapLogbookDetail(":idUser") },
        ]}
        variant={5}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail Rekap Logbook
          </h1>
          <p className="text-gray-500">Halaman detail rekap logbook</p>
        </div>
      </div>
    </div>
  );
}
