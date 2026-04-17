import { z } from "zod";

export const staseSchema = z.object({
  user: z.string().min(1, "User harus dipilih"),
  stase: z.string().min(1, "Stase harus dipilih"),
  stage: z.string().min(1, "Stage harus dipilih"),
  semester: z.string().min(1, "Semester harus dipilih"),
  date: z.date().min(1, "Date harus diisi"),
  notes: z.string().optional(),
  mengulangStase: z.boolean(),
});

export type StaseFormData = z.infer<typeof staseSchema>;

// Initial values for create mode
export const createInitialStaseValues: StaseFormData = {
  user: "",
  stase: "",
  stage: "",
  semester: "",
  date: undefined as unknown as Date,
  notes: "",
  mengulangStase: false,
};
