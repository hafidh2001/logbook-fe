import { Nullable } from "@/types";

export type TPpds = {
  id: number;
  display_name: string;
  username: string;
  email: string;
  phone: Nullable<string>;
  address: Nullable<string>;
  date_of_birth: Nullable<string>;
  nim: Nullable<string>;
  role_name: Nullable<string>;
  stase_name: Nullable<string>;
  total_logbook: number;
};

export interface IPpdsListParams {
  id_client: number;
  page: number;
  limit: number;
  status?: Nullable<string>;
  ppds?: Nullable<number>;
  stase?: Nullable<number>;
  nim?: Nullable<string>;
}
