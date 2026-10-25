export type LogbookEditPermissionInput = {
  role: string | null | undefined;
  action: Record<string, unknown> | null | undefined;
  verifiedStatus: unknown;
  verified?: unknown;
  fromExplore: boolean;
};

function isEnabled(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export function canEditLogbookRecord({
  role,
  action,
  verifiedStatus,
  verified,
  fromExplore,
}: LogbookEditPermissionInput) {
  if (fromExplore) return false;

  const normalizedRole = String(role ?? '')
    .trim()
    .toLowerCase();
  const normalizedStatus =
    verifiedStatus === null || verifiedStatus === undefined || verifiedStatus === ''
      ? isEnabled(verified)
        ? 'verified'
        : 'pending'
      : String(verifiedStatus).trim().toLowerCase();

  if (normalizedRole === 'ppds') {
    return ['pending', 'revised', 'rejected'].includes(normalizedStatus);
  }

  return (
    (normalizedRole === 'staff' || normalizedRole === 'staff jejaring') &&
    isEnabled(action?.is_exam)
  );
}
