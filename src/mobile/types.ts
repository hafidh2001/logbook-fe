import { ROUTES } from '@/utils/routes';
export type MobileRole = 'ppds' | 'staff';
export interface MobileUser {
  id: number; id_client: number; id_role: number; role_name: string;
  display_name: string; username: string; code: string; client_name: string;
  email: string; phone: string; address: string; date_of_birth: string;
  id_semester: number | null; id_stase: number | null;
  semester_name: string; stase_name: string; total_points?: number | null;
  status: string; name: string; role: MobileRole;
}
export function mobileRole(name: unknown): MobileRole | null {
  const role = String(name ?? '').trim().toLowerCase();
  return role === 'ppds' ? 'ppds' : ['staff', 'staff jejaring'].includes(role) ? 'staff' : null;
}
export function authDestination(name: unknown): string {
  if (mobileRole(name)) return '/mobile';
  return String(name ?? '').trim().toLowerCase() === 'institution' ? ROUTES.dashboard : ROUTES.login;
}
export function parseMobileUser(payload: unknown): MobileUser | null {
  if (!payload || typeof payload !== 'object') return null;
  const envelope = payload as Record<string, any>;
  if (envelope.success !== true && envelope.success !== 'true') return null;
  const data = Array.isArray(envelope.data) ? envelope.data[0] : envelope.data;
  if (!data || typeof data !== 'object') return null;
  const role = mobileRole(data.role_name ?? data.role);
  const id = Number(data.id ?? data.user_id), client = Number(data.id_client ?? data.client_id);
  if (!role || !Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(client) || client <= 0 || !data.username) return null;
  // Explicit allowlist: never persist passwords or an arbitrary login response.
  return { id, id_client: client, id_role: Number(data.id_role ?? data.role_id), role,
    role_name: String(data.role_name ?? data.role), name: String(data.display_name ?? data.name ?? data.username),
    display_name: String(data.display_name ?? data.name ?? data.username), username: String(data.username),
    code: String(data.code ?? ''), client_name: String(data.client_name ?? ''),
    email: String(data.email ?? ''), phone: String(data.phone ?? ''), address: String(data.address ?? ''),
    date_of_birth: String(data.date_of_birth ?? ''), status: String(data.status ?? ''),
    id_semester: data.id_semester == null ? null : Number(data.id_semester),
    id_stase: data.id_stase == null ? null : Number(data.id_stase),
    semester_name: String(data.semester_name ?? ''), stase_name: String(data.stase_name ?? ''),
    total_points: data.total_points == null ? null : Number(data.total_points) };
}
