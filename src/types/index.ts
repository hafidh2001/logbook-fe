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

export enum ActionRoleEnum {
  ADMIN = "Admin",
  PESERTA = "Peserta",
  STAFF_PENGAJAR = "Staff Pengajar",
  PENGUJI_1 = "Penguji 1",
  PEMBIMBING_1 = "Pembimbing 1",
  PEMBIMBING_2 = "Pembimbing 2",
  PEMBIMBING_3 = "Pembimbing 3",
}

export enum UserStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  LULUS = "Lulus",
}

export enum LogbookStatusEnum {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  REVISED = "revised",
}
