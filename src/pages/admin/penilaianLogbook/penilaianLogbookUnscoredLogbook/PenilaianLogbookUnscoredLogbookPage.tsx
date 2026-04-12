import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PenilaianLogbookUnscoredLogbookPage() {
  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Penilaian Logbook", to: ROUTES.penilaianLogbook },
          {
            label: "Detail",
            to: ROUTES.penilaianLogbookDetail(":idLogbookCategory"),
          },
          {
            label: "Belum Dinilai",
            to: ROUTES.penilaianLogbookUnscoredLogbook(":idLogbookCategory"),
          },
        ]}
        
        searchPlaceholder="Cari logbook..."
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Logbook Belum Dinilai
          </h1>
          <p className="text-gray-500">Halaman logbook yang belum dinilai</p>
        </div>
      </div>
    </div>
  );
}
