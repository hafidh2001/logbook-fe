// Browser adaptation of C:/Data/Driya/logbook Mobile NotificationScreen pure helpers.
type Row = Record<string, any>;
export function mapNotificationItem(item: Row, index: number) {
  const rawMessage =
    item.message?.trim() ||
    item.description?.trim() ||
    item.body?.trim() ||
    item.notes?.trim() ||
    '-';
  const type = String(item.type ?? '').trim().toLowerCase();
  const ppdsName = String(item.ppds_name ?? '').trim();
  const actionName = String(item.action_name ?? '').trim();
  const isRevisionRequestNotice = type === 'verify' && rawMessage.toLowerCase().includes('merevisi logbook');
  const isVerificationNotice = type === 'verify' && ppdsName && actionName && !isRevisionRequestNotice;
  const dateAndRequest = rawMessage.match(/\bpada\b[\s\S]*$/i)?.[0];

  // Convert raw UTC timestamps in the message body to local WIB format.
  // Matches patterns like "2026-09-30 11:55:10+00" or "2026-09-30 07:44:15+00".
  const convertedMessage = rawMessage.replace(
    /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(?:\.\d+)?([+-]\d{2}(?::?\d{2})?)/g,
    (_match: string, datePart: string, timePart: string, tzPart: string) => {
      let tz = tzPart.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
      if (/^[+-]\d{2}$/.test(tz)) tz += ':00';
      const d = new Date(`${datePart}T${timePart}${tz}`);
      if (Number.isNaN(d.getTime())) return _match;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
  );

  // A revision is also type=verify for routing, but its event text must remain
  // distinct from Create: "Jeki merevisi logbook ...".
  const message = isVerificationNotice
    ? `${ppdsName} menambahkan data ${actionName}${dateAndRequest ? ` ${dateAndRequest}` : '.'}`
    : convertedMessage;

  return {
    id: item.id ?? null,
    logbookId: getNotificationLogbookId(item),
    key: String(item.id ?? index),
    title: isRevisionRequestNotice
      ? 'Logbook Direvisi'
      : isVerificationNotice
      ? 'Logbook Menunggu Verifikasi'
      : item.title?.trim() || 'Notifikasi',
    message,
    timeAgo: formatNotificationTimeAgo(
      item.created_date || item.updated_date || item.date,
    ),
    isRead: normalizeNotificationRead(item.read),
    status: getNotificationStatus(item, message),
  };
}

function getNotificationStatus(
  item: Row,
  message: string,
): 'rejected' | 'revised' | null {
  const type = String(item.type ?? '').trim().toLowerCase();
  if (type === 'rejected' || type === 'reject') return 'rejected';
  if (type === 'revised' || type === 'revision' || type === 'unverify') return 'revised';

  const source = message.toLowerCase();
  if (/\bditolak\b|\brejected\b/.test(source)) return 'rejected';
  if (/dibatalkan\s+verifikasinya|\bdiunverify\b/.test(source)) return 'revised';
  return null;
}

function getNotificationLogbookId(item: Row) {
  const directCandidates = [
    item.id_logbook,
    item.logbook_id,
    item.logbookId,
    item.reference_id,
    item.ref_id,
    item.id_ref,
    (item.t_logbook as Record<string, unknown> | null)?.id,
    (item.detail as Record<string, unknown> | null)?.id_logbook,
    (item.detail as Record<string, unknown> | null)?.logbook_id,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'number') {
      return candidate;
    }

    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  const rawUrl = String(item.url ?? '').trim();
  if (!rawUrl) {
    return null;
  }

  const segments = rawUrl.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) {
    return null;
  }

  const numericId = Number(lastSegment);
  if (Number.isFinite(numericId)) {
    return numericId;
  }

  return lastSegment;
}

function normalizeNotificationRead(value: Row['read']) {
  if (value === true || value === 1) {
    return true;
  }

  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
}

export function formatNotificationTimeAgo(value: string | null | undefined) {
  if (!value) {
    return '-';
  }

  let raw = String(value).trim();
  raw = raw.replace(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)/,
    '$1T$2',
  );
  raw = raw.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  raw = raw.replace(/([+-]\d{2})$/, '$1:00');

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'Baru saja';
  }

  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  if (diffDays < 30) {
    return `${diffDays} hari lalu`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/** User click only: start Detail immediately; read acknowledgement cannot block navigation. */
export async function openNotification(
  item: Row, user: {id: number; id_client: number},
  request: (endpoint: string, payload: Row) => Promise<any>,
  onRead: () => void,
): Promise<string | null> {
  const mapped = mapNotificationItem(item, 0);
  // Start detail resolution first, before the independent best-effort read.
  const detail = resolveDetail();
  if (!mapped.isRead && mapped.id !== null) {
    void request('readNotification', {id: mapped.id, id_user: user.id, id_client: user.id_client})
      .then(read => { if (read.success === true) onRead(); })
      .catch(() => { /* Keep unread on failure; Detail remains available. */ });
  }
  return detail;
  async function resolveDetail(): Promise<string | null> {
    if (mapped.logbookId === null) return null;
    const result = await request('getLogbookById', {
      id: mapped.logbookId, user_id: user.id, id_client: user.id_client,
    });
    const record = result.data;
    const validId = (value: unknown) => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
    if (result.success !== true || !record || String(record.id) !== String(mapped.logbookId)
      || !validId(record.id_action)
      || (record.id_client != null && Number(record.id_client) !== user.id_client)) {
      throw new Error('Detail atau aktivitas logbook tidak valid.');
    }
    return `/mobile/logbooks/${encodeURIComponent(record.id_action)}/${encodeURIComponent(record.id)}`;
  }
}
