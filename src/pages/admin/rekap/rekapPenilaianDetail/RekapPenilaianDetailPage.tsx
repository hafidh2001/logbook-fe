import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function RekapPenilaianDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Rekap" },
          { label: "Penilaian", to: ROUTES.rekapPenilaian },
          { label: "Detail", to: ROUTES.rekapPenilaianDetail(":idUser") },
        ]}
        variant={5}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail Rekap Penilaian
          </h1>
          <p className="text-gray-500">Halaman detail rekap penilaian</p>
        </div>
      </div>
    </div>
  );
}
