import { ReactNode } from "react";

// Re-export Nullable from shared types
export type Nullable<D> = D | null | undefined;

export interface BasicSelectOpt<T = string> {
  label: ReactNode | string;
  value: T;
}

// Global enums used across modules
export enum RoleEnum {
  PPDS = "ppds",
  STAFF = "staff",
  INSTITUTION = "institution",
  PATIENTS = "patients",
}
