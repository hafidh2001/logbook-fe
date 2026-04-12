// Global enums used across modules

export enum RoleEnum {
  PPDS = "ppds",
  STAFF = "staff",
  INSTITUTION = "institution",
  PATIENTS = "patients",
}

// Re-export Topbar types
export type { Breadcrumb, TopbarProps } from "./topbar";