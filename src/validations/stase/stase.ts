import { z } from "zod";

export const staseSchema = z.object({
  id_user: z.number({ message: "User harus dipilih" }).nullable(),
  id_stase: z.number({ message: "Stase harus dipilih" }).nullable(),
  id_stage: z.number({ message: "Stage harus dipilih" }).nullable(),
  id_semester: z.number({ message: "Semester harus dipilih" }).nullable(),
  date: z.date({ message: "Date harus diisi" }),
  notes: z.string().optional(),
  is_retake: z.boolean(),
});

export type StaseFormData = z.infer<typeof staseSchema>;

// Initial values for create mode
export const createInitialStaseValues: StaseFormData = {
  id_user: null,
  id_stase: null,
  id_stage: null,
  id_semester: null,
  date: undefined as unknown as Date,
  notes: "",
  is_retake: false,
};
