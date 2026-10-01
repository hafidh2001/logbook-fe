import { SingleSelect } from "@/components/fields/singleSelect";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useMasterStore } from "@/store/masterStore";
import { useRekapStore } from "@/store/rekapStore";
import { showToast } from "@/utils/toast";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface Props {
  selectedIds: Array<string | number>;
  setSelectedIds: Dispatch<SetStateAction<Array<string | number>>>;
  isLoadingFormStase: boolean;
  setIsLoadingFormStase: (value: boolean) => void;
}

export const FormStase = ({
  selectedIds,
  setSelectedIds,
  isLoadingFormStase: isLoading,
  setIsLoadingFormStase: setIsLoading,
}: Props) => {
  const { staseOptions, fetchStaseOptions } = useMasterStore();
  const { updateMultipleLogbook } = useRekapStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id_client) {
      fetchStaseOptions({ id_client: user.id_client });
    }
  }, [user?.id_client, fetchStaseOptions]);

  const [selectedStase, setSelectedStase] = useState<number | null>(null);

  const handleSave = useCallback(async () => {
    if (!selectedStase || selectedIds.length === 0) {
      showToast("Pilih stase dan logbook terlebih dahulu!", "error");
      return;
    }

    setIsLoading(true);

    try {
      const success = await updateMultipleLogbook({
        id_client: user?.id_client ?? 0,
        id_stase: selectedStase,
        updated_by: user?.id ?? 0,
        data: selectedIds.map(String),
      });

      if (success) {
        const successMessage = useRekapStore.getState().successLogbook;
        showToast(successMessage ?? "Data berhasil diperbarui!", "success");
        setSelectedIds([]);
      } else {
        const errorMessage = useRekapStore.getState().error;
        showToast(errorMessage ?? "Data gagal diperbarui!", "error", {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedStase,
    selectedIds,
    user,
    updateMultipleLogbook,
    setSelectedIds,
    showToast,
  ]);

  const handleCancel = () => {
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <span>{selectedIds.length} baris terpilih</span>

      <SingleSelect
        options={staseOptions}
        value={staseOptions.find((opt) => opt.value === selectedStase) || null}
        onChange={(option) =>
          option?.value && setSelectedStase(Number(option.value))
        }
        isSearchable
        isClearable={false}
        placeholder="Pilih Stase Baru ..."
        className="w-[200px]"
      />

      <div className="flex flex-row gap-2">
        <Button variant="default" onClick={handleSave} disabled={isLoading}>
          <span className="inline">Ubah Stase</span>
        </Button>

        <Button variant="secondary" onClick={handleCancel}>
          <span className="inline">Batal Pilih</span>
        </Button>
      </div>
    </div>
  );
};
