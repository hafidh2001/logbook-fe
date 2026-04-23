import { Nullable, RoleEnum } from "@/types";

export type TAuthUser = {
  id: number;
  display_name: string;
  username: Nullable<string>;
  email: Nullable<string>;
  id_role: number;
  is_deleted: boolean;
  created_date: string;
  created_by: Nullable<number>;
  updated_date: Nullable<string>;
  updated_by: Nullable<number>;
  phone: Nullable<string>;
  address: Nullable<string>;
  date_of_birth: Nullable<string>;
  code: Nullable<string>;
  picture: Nullable<string>;
  id_institution: Nullable<number>;
  id_sub_category: Nullable<number>;
  id_semester: Nullable<number>;
  id_stase: Nullable<number>;
  id_client: number;
  gender: Nullable<string>;
  id_year: Nullable<number>;
  status: string;
  inisial_code: Nullable<string>;
  is_show: boolean;
  deleted_at: Nullable<string>;
  inactive_at: Nullable<string>;
  inactive_notes: Nullable<string>;
  reactivate_date: Nullable<string>;
  // relationship
  role_name: RoleEnum;
  client_name: string;
};
export interface ILoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface IProfilePayload {
  id_user: number;
  display_name: string;
  email: Nullable<string>;
  phone: Nullable<string>;
  address: Nullable<string>;
  date_of_birth: Nullable<string>;
  code: Nullable<string>;
}
