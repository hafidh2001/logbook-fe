import { ReactNode } from "react";

// Re-export Nullable from shared types
export type Nullable<D> = D | null | undefined;

export interface BasicSelectOpt<T = string> {
  label: ReactNode | string;
  value: T;
}

// API Standard Response type
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginationResponse<T> extends ApiResponse<T> {
  total: number;
  pagination: {
    page: number;
    limit: number;
  };
}

// Global enums used across modules
export enum RoleEnum {
  PPDS = "ppds",
  STAFF = "staff",
  INSTITUTION = "institution",
  PATIENTS = "patients",
}

export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  LULUS = "Lulus",
}
