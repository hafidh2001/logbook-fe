import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PenilaianLogbookScoredLogbookPage() {
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
            label: "Sudah Dinilai",
            to: ROUTES.penilaianLogbookScoredLogbook(":idLogbookCategory"),
          },
        ]}
        
        searchPlaceholder="Cari logbook..."
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Logbook Sudah Dinilai
          </h1>
          <p className="text-gray-500">Halaman logbook yang sudah dinilai</p>
        </div>
      </div>
    </div>
  );
}
