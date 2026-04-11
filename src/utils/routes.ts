export class ROUTES {
  // Base Routes
  static get base() {
    return `/` as const;
  }

  static get example() {
    return `/example` as const;
  }

  static exampleDetail() {
    return `${this.example}/detail` as const;
  }

  static exampleItem(exampleId: string): string {
    return `${this.example}/${exampleId}` as const;
  }

  static exampleSubItem(exampleId: string, itemId: string): string {
    return `${this.example}/${exampleId}/${itemId}` as const;
  }

  // Auth Routes
  static get login() {
    return `/auth/login` as const;
  }

  static get logout() {
    return `/logout` as const;
  }

  // Admin Routes
  static get dashboard() {
    return `/admin/dashboard` as const;
  }

  // PPDS Routes
  static get ppds() {
    return `/admin/ppds` as const;
  }

  static ppdsDetail(idUser: string) {
    return `${this.ppds}/${idUser}` as const;
  }

  static ppdsChangePassword(idUser: string) {
    return `${this.ppdsDetail(idUser)}/change-password` as const;
  }

  static ppdsLogbook(idUser: string) {
    return `${this.ppdsDetail(idUser)}/logbook` as const;
  }

  static ppdsLogbookDetail(idUser: string, idLogbook: string) {
    return `${this.ppdsLogbook(idUser)}/${idLogbook}` as const;
  }

  // PPDS Inactive Routes
  static get ppdsInactive() {
    return `/admin/ppds-inactive` as const;
  }

  static ppdsInactiveDetail(idUser: string) {
    return `${this.ppdsInactive}/${idUser}` as const;
  }

  static ppdsInactiveLogbook(idUser: string) {
    return `${this.ppdsInactiveDetail(idUser)}/logbook` as const;
  }

  static ppdsInactiveLogbookDetail(idUser: string, idLogbook: string) {
    return `${this.ppdsInactiveLogbook(idUser)}/${idLogbook}` as const;
  }

  // Staff Routes
  static get staff() {
    return `/admin/staff` as const;
  }

  static staffDetail(idUser: string) {
    return `${this.staff}/${idUser}` as const;
  }

  static staffChangePassword(idUser: string) {
    return `${this.staffDetail(idUser)}/change-password` as const;
  }

  static staffLogbook(idUser: string) {
    return `${this.staffDetail(idUser)}/logbook` as const;
  }

  static staffLogbookDetail(idUser: string, idLogbook: string) {
    return `${this.staffLogbook(idUser)}/${idLogbook}` as const;
  }

  // Stase Routes
  static get stase() {
    return `/admin/stase` as const;
  }

  static staseDetail(idUser: string) {
    return `${this.stase}/${idUser}` as const;
  }

  // Penilaian Logbook Routes
  static get penilaianLogbook() {
    return `/admin/penilaian-logbook` as const;
  }

  static penilaianLogbookDetail(idLogbookCategory: string) {
    return `${this.penilaianLogbook}/${idLogbookCategory}` as const;
  }

  static penilaianLogbookScoredLogbook(idLogbookCategory: string) {
    return `${this.penilaianLogbookDetail(idLogbookCategory)}/scored-logbook` as const;
  }

  static penilaianLogbookScoredLogbookDetail(idLogbookCategory: string, idLogbook: string) {
    return `${this.penilaianLogbookScoredLogbook(idLogbookCategory)}/${idLogbook}` as const;
  }

  static penilaianLogbookUnscoredLogbook(idLogbookCategory: string) {
    return `${this.penilaianLogbookDetail(idLogbookCategory)}/unscored-logbook` as const;
  }

  static penilaianLogbookUnscoredLogbookDetail(idLogbookCategory: string, idLogbook: string) {
    return `${this.penilaianLogbookUnscoredLogbook(idLogbookCategory)}/${idLogbook}` as const;
  }

  // Rekap Routes
  static get rekapReport() {
    return `/admin/rekap-report` as const;
  }

  static rekapReportDetail(idUser: string) {
    return `${this.rekapReport}/${idUser}` as const;
  }

  static get rekapPenilaian() {
    return `/admin/rekap-penilaian` as const;
  }

  static rekapPenilaianDetail(idUser: string) {
    return `${this.rekapPenilaian}/${idUser}` as const;
  }

  static get rekapLogbook() {
    return `/admin/rekap-logbook` as const;
  }

  static rekapLogbookDetail(idUser: string) {
    return `${this.rekapLogbook}/${idUser}` as const;
  }

  // Profile Routes
  static get profile() {
    return `/profile` as const;
  }
}
