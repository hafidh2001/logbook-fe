import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function RekapReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Report", to: ROUTES.rekapReport },
        ]}
        variant={3}
        searchPlaceholder="Cari report..."
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Rekap Report
          </h1>
          <p className="text-gray-500">Halaman rekap report</p>
        </div>
      </div>
    </div>
  );
}
