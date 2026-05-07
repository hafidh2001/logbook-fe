import { RoleEnum } from "@/types";

export interface IMasterOptions {
  id: number;
  name: string;
  id_stage?: number;
}

export interface IMasterParams {
  id_client: number;
}

export interface IMasterUserParams extends IMasterParams {
  role_name: RoleEnum;
}
