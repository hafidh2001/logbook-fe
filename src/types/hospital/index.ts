import { Nullable } from "@/types";

export type THospital = {
  id: number;
  name: string;
  code: string;  
  address: Nullable<string>;
  notes: Nullable<string>;
};

export interface IHospitalPayload {
    id_client: number;
    name: string;
    code: string;  
    address: Nullable<string>;
    notes: Nullable<string>;
}

export interface IHospitalListParams {
    id_client: number;
    page?: number;
    limit?: number;
    search?: string | null;
}

export interface IHospitalCreatePayload extends IHospitalPayload {
    created_by: number;
}

export interface IHospitalUpdatePayload extends IHospitalPayload {
    id: number;
    updated_by: number;
}