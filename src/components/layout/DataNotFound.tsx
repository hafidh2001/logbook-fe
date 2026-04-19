import { icons } from "@/assets/images/Icon";
import { TBreadcrumb } from "@/types/topbar";
import { useNavigate } from "react-router-dom";

interface Props {
  breadcrumbs: TBreadcrumb[];
  message?: string;
  detailMessage?: string;
}

export const DataNotFound = ({
  breadcrumbs,
  message = "Data Tidak Ditemukan",
  detailMessage,
}: Props) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Find the last breadcrumb with a 'to' property
    const backRoute = [...breadcrumbs].reverse().find((bc) => bc.to)?.to;

    if (backRoute) {
      navigate(backRoute);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
        {detailMessage && <p className="text-gray-500 mb-4">{detailMessage}</p>}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <icons.ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
      </div>
    </div>
  );
};
