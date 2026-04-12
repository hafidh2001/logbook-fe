import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaffLogbookDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(":idUser") },
          { label: "Logbook", to: ROUTES.staffLogbook(":idUser") },
          {
            label: "Detail",
            to: ROUTES.staffLogbookDetail(":idUser", ":idLogbook"),
          },
        ]}
        
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail Logbook Staff
          </h1>
          <p className="text-gray-500">Halaman detail logbook staff</p>
        </div>
      </div>
    </div>
  );
}
