export interface LogbookByStatus {
  status: string;
  count: number;
}

export interface LogAktivitas {
  message: string;
}

export interface PpdsPerStage {
  stage: string;
  count: number;
}

export interface PpdsPerStase {
  stase: string;
  count: number;
}

export interface MenungguVerifikasi {
  activity: string;
  staff: string;
  date: string;
}

export interface PpdsBaruPerYear {
  year: string;
  count: number;
}

export interface KinerjaDpjp {
  name: string;
  total_logbook: number;
  pending: number;
  verified: number;
}

export interface KinerjaPpds {
  name: string;
  stase: string;
  verified_count: number;
}

export interface DashboardData {
  team_name: string;
  year: string;
  active_ppds_count: number;
  total_ppds: number;
  inactive_ppds_count: number;
  activity_count: number;
  staff_pengajar_count: number;
  stage_count: number;
  logbook_count: number;
  unverified_logbook_count: number;
  logbook_by_status: LogbookByStatus[];
  log_aktivitas: LogAktivitas[];
  ppds_per_stage: PpdsPerStage[];
  ppds_per_stase: PpdsPerStase[];
  menunggu_verifikasi: MenungguVerifikasi[];
  ppds_baru_per_year: PpdsBaruPerYear[];
  kinerja_dpjp: KinerjaDpjp[];
  kinerja_ppds: KinerjaPpds[];
}

export const mockDashboard: DashboardData = {
  team_name: "DEV TEAM",
  year: "2023/2024",
  active_ppds_count: 9,
  total_ppds: 11,
  inactive_ppds_count: 2,
  activity_count: 17,
  staff_pengajar_count: 11,
  stage_count: 6,
  logbook_count: 549,
  unverified_logbook_count: 72,

  logbook_by_status: [
    { status: "Verified (73.04%)", count: 401 },
    { status: "Rejected (4.37%)", count: 24 },
    { status: "Revised (3.28%)", count: 18 },
    { status: "Pending (13.11%)", count: 72 },
  ],

  log_aktivitas: [
    {
      message:
        "Data Course 15/04/2026 13:29 telah diverifikasi oleh DIANTI STAFF pada 15/04/2026 13:30",
    },
    {
      message:
        "Ujang menambahkan data Course pada 15/04/2026 13:29, Mohon berikan verifikasi anda. Klik detail untuk melihat logbook",
    },
    {
      message:
        "Data Ilmiah Non Stase 08/04/2026 13:38 telah diverifikasi oleh DIANTI STAFF pada 09/04/2026 11:22",
    },
    {
      message:
        "Data Course 09/04/2026 10:59 telah diverifikasi oleh DIANTI STAFF pada 09/04/2026 11:07",
    },
    {
      message:
        "Data Pengabdian Masyarakat 09/04/2026 10:58 telah diverifikasi oleh DIANTI STAFF pada 09/04/2026 11:06",
    },
    {
      message:
        "Data Ekstrakulikuler 09/04/2026 10:58 telah diverifikasi oleh DIANTI STAFF pada 09/04/2026 11:06",
    },
    {
      message:
        "Ujang menambahkan data Course pada 09/04/2026 10:59, Mohon berikan verifikasi anda. Klik detail untuk melihat logbook",
    },
  ],

  ppds_per_stage: [
    { stage: "Orthopaedi Lanjut II", count: 4 },
    { stage: "Pra Orthopedi Dasar", count: 4 },
    { stage: "Orthopaedi Lanjut I", count: 3 },
  ],

  ppds_per_stase: [
    { stase: "Stase Rekon II", count: 4 },
    { stase: "Rehabilitasi Medik", count: 4 },
    { stase: "Stase Hand I", count: 3 },
  ],

  menunggu_verifikasi: [
    { activity: "Proposal Thesis", staff: "DIANTI STAFF", date: "08 Apr 2026" },
    {
      activity: "Kegiatan Poli Klinik",
      staff: "DIANTI STAFF",
      date: "06 Apr 2026",
    },
    { activity: "Review Artikel", staff: "DIANTI STAFF", date: "06 Apr 2026" },
    {
      activity: "Kegiatan Jaga / IGD / Emergency",
      staff: "Staff Pengajar Demo",
      date: "17 Dec 2024",
    },
    { activity: "Proposal Thesis", staff: "DIANTI STAFF", date: "08 Apr 2026" },
    {
      activity: "Kegiatan Poli Klinik",
      staff: "DIANTI STAFF",
      date: "06 Apr 2026",
    },
    { activity: "Review Artikel", staff: "DIANTI STAFF", date: "06 Apr 2026" },
    {
      activity: "Kegiatan Jaga / IGD / Emergency",
      staff: "Staff Pengajar Demo",
      date: "17 Dec 2024",
    },
  ],

  ppds_baru_per_year: [
    { year: "2023", count: 20 },
    { year: "2024", count: 16 },
    { year: "2026", count: 8 },
  ],

  kinerja_dpjp: [
    { name: "Staff Pengajar Demo", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 2", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 3", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 4", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 2", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 3", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 4", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 2", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 3", total_logbook: 0, pending: 0, verified: 0 },
    { name: "dr Test 4", total_logbook: 0, pending: 0, verified: 0 },
  ],

  kinerja_ppds: [
    { name: "Ujang", stase: "Stase Hand I", verified_count: 27 },
    { name: "Yudhistira", stase: "Rehabilitasi Medik", verified_count: 10 },
    { name: "Test PPDS", stase: "Stase Rekon II", verified_count: 0 },
    { name: "Ujang", stase: "Stase Hand I", verified_count: 27 },
    { name: "Yudhistira", stase: "Rehabilitasi Medik", verified_count: 10 },
    { name: "Test PPDS", stase: "Stase Rekon II", verified_count: 0 },
    { name: "Ujang", stase: "Stase Hand I", verified_count: 27 },
    { name: "Yudhistira", stase: "Rehabilitasi Medik", verified_count: 10 },
    { name: "Test PPDS", stase: "Stase Rekon II", verified_count: 0 },
  ],
};
