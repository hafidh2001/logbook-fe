import { RoleEnum } from "@/types";

export type MockUser = {
  username: string;
  password: string;
  role: RoleEnum;
  name: string;
};

export const mockUsers: MockUser[] = [
  {
    username: "dianti",
    password: "12345",
    role: RoleEnum.INSTITUTION,
    name: "Institusi User",
  },
  {
    username: "dianti_ppds",
    password: "12345",
    role: RoleEnum.PPDS,
    name: "PPDS User",
  },
  {
    username: "dianti_staff",
    password: "12345",
    role: RoleEnum.STAFF,
    name: "Staff User",
  },
];
