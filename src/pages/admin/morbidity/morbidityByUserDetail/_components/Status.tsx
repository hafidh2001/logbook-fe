import { CardWrapper } from "@/components/card/cardWrapper";
import { SingleSelect } from "@/components/fields/singleSelect";
import { StatusBadge } from "@/components/statusBadge";
import { useAuthStore } from "@/store/authStore";
import { useMorbidityStore } from "@/store/morbidityStore";
import { morbidityApi } from "@/services/morbidityApi";
import { BasicSelectOpt, type Nullable } from "@/types";
import { TMorbidityByUserDetail } from "@/types/morbidity";
import { showToast } from "@/utils/toast";
import { Fragment, useCallback, useEffect, useState } from "react";

interface Props {
  data: TMorbidityByUserDetail | null;
}

const title = "Status Verifikasi";

/**
 * Check if a staff row is an editable verifier role (Penilai/GKM or KPS).
 * Pelapor rows are never editable.
 */
function isEditableRole(roleIdentifier: Nullable<string>): boolean {
  if (!roleIdentifier) return false;
  const id = roleIdentifier.toLowerCase();
  return (
    id.includes("penilai") ||
    id.includes("gkm") ||
    id.includes("kps")
  );
}

export const Status = ({ data }: Props) => {
  const { user } = useAuthStore();
  const { updateVerifier } = useMorbidityStore();

  // Staff options for the dropdown
  const [staffOptions, setStaffOptions] = useState<
    BasicSelectOpt<number>[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Track selected user per status_id
  const [selections, setSelections] = useState<
    Record<number, BasicSelectOpt<number> | null>
  >({});
  // Track saving state per status_id
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  // Load staff options once
  useEffect(() => {
    if (!user?.id_client) return;

    let cancelled = false;
    setLoadingOptions(true);

    morbidityApi
      .getMasterStaff({ id_client: user.id_client })
      .then((res) => {
        if (cancelled) return;
        const opts = (res.data ?? []).map((s) => ({
          label: s.name,
          value: s.id,
        }));
        setStaffOptions(opts);
      })
      .catch(() => {
        // silently ignore – dropdown will be empty
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id_client]);

  // Initialise selections from current data
  useEffect(() => {
    if (!data?.staff) return;
    const init: Record<number, BasicSelectOpt<number> | null> = {};
    for (const item of data.staff) {
      if (isEditableRole(item.role_identifier)) {
        init[item.status_id] = {
          label: item.name ?? "-",
          value: item.id_user,
        };
      }
    }
    setSelections(init);
  }, [data?.staff]);

  const handleSave = useCallback(
    async (statusId: number) => {
      if (!data) return;
      const selected = selections[statusId];
      if (!selected) {
        showToast("Pilih staff terlebih dahulu", "error");
        return;
      }

      setSaving((prev) => ({ ...prev, [statusId]: true }));
      try {
        await updateVerifier({
          id_logbook: data.id,
          status_id: statusId,
          new_id_user: selected.value,
        });
        showToast("Verifier berhasil diubah!");
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Gagal mengubah verifier",
          "error",
        );
      } finally {
        setSaving((prev) => ({ ...prev, [statusId]: false }));
      }
    },
    [data, selections, updateVerifier],
  );

  if (data?.staff.length === 0) {
    return (
      <CardWrapper title={title} contentClassName="flex flex-col gap-3">
        <span className="text-sm text-gray-500">-</span>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper title={title} contentClassName="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <span className="text-sm text-gray-500 text-nowrap">
            Status Logbook
          </span>
        </div>
        <StatusBadge status={data?.status.toLowerCase() ?? null} />
      </div>
      <hr />
      <br />
      {data?.staff.map((item, index: number) => {
        const editable =
          isEditableRole(item.role_identifier) &&
          item.status?.toLowerCase() !== "verified";
        const statusId = item.status_id;

        return (
          <Fragment key={index}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-800 block">
                  {item.role ?? "-"}
                </span>

                {editable ? (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 max-w-xs">
                      <SingleSelect
                        placeholder="Pilih Staff..."
                        options={staffOptions}
                        value={selections[statusId] ?? null}
                        onChange={(val) =>
                          setSelections((prev) => ({
                            ...prev,
                            [statusId]:
                              val as BasicSelectOpt<number> | null,
                          }))
                        }
                        isLoading={loadingOptions}
                        isClearable={false}
                        isSearchable
                      />
                    </div>
                    <button
                      type="button"
                      disabled={
                        saving[statusId] ||
                        !selections[statusId] ||
                        selections[statusId]?.value === item.id_user
                      }
                      onClick={() => handleSave(statusId)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      {saving[statusId] ? "Saving..." : "Simpan"}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600 block">
                    {item.name ?? "-"}
                  </span>
                )}

                <div className="flex flex-row items-center">
                  <span className="text-sm text-gray-600">
                    Catatan Verifikasi :{" "}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.verify_notes ?? " -"}
                  </span>
                </div>
              </div>
              <StatusBadge status={item.status ?? null} />
            </div>
            {index !== data?.staff.length - 1 && <hr />}
          </Fragment>
        );
      })}
    </CardWrapper>
  );
};
