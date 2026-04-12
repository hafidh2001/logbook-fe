import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PenilaianLogbookUnscoredLogbookDetailPage() {
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
            label: "Unscored",
            to: ROUTES.penilaianLogbookUnscoredLogbook(":idLogbookCategory"),
          },
          {
            label: "Detail Unscored Logbook",
            to: ROUTES.penilaianLogbookUnscoredLogbookDetail(
              ":idLogbookCategory",
              ":idLogbook",
            ),
          },
        ]}
        
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail Logbook Belum Dinilai
          </h1>
          <p className="text-gray-500">
            Halaman detail logbook yang belum dinilai
          </p>
        </div>
      </div>
    </div>
  );
}
