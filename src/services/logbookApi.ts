import { mockStaffLogbook } from "@/data/staff";
import { mockPpdsLogbook, mockPpdsInactiveList } from "@/data/ppds";
import { mockPenilaianLogbookStatusList } from "@/data/penilaianLogbook";

export type StaffLogbookEntry = {
  no: number;
  date: string;
  ppds: string | null;
  activity: string;
  hospital: string | null;
  notes: string;
  verifiedStatus: "pending" | "verified";
};

export type PpdsLogbookEntry = {
  no: number;
  date: string;
  staffPengajar: string | null;
  activity: string;
  hospital: string | null;
  notes: string;
  verifiedStatus: "pending" | "verified";
};

export type StaffLogbookData = {
  participant: {
    displayName: string;
    code: string | null;
  };
  logbooks: StaffLogbookEntry[];
};

export type PpdsLogbookData = {
  participant: {
    displayName: string;
    nim: string;
  };
  logbooks: PpdsLogbookEntry[];
};

export const logbookApi = {
  async getStaffLogbook(id: string): Promise<StaffLogbookData> {
    // Simulate API call - in real app, fetch by id
    console.log("Fetching staff logbook for:", id);
    return mockStaffLogbook as StaffLogbookData;
  },

  async getStaffLogbookById(id: string, logbookId: string): Promise<StaffLogbookEntry | null> {
    console.log("Fetching staff logbook detail for:", id, logbookId);
    const data = mockStaffLogbook as StaffLogbookData;
    return data.logbooks.find((item) => item.no === Number(logbookId)) || null;
  },

  async getPpdsLogbook(id: string): Promise<PpdsLogbookData> {
    // Simulate API call - in real app, fetch by id
    console.log("Fetching ppds logbook for:", id);
    return mockPpdsLogbook as PpdsLogbookData;
  },

  async getPpdsLogbookById(id: string, logbookId: string): Promise<PpdsLogbookEntry | null> {
    console.log("Fetching ppds logbook detail for:", id, logbookId);
    const data = mockPpdsLogbook as PpdsLogbookData;
    return data.logbooks.find((item) => item.no === Number(logbookId)) || null;
  },

  async getPpdsInactiveList(): Promise<typeof mockPpdsInactiveList> {
    // Simulate API call
    return mockPpdsInactiveList;
  },

  async getPenilaianLogbookDetailById(id: string): Promise<typeof mockPenilaianLogbookStatusList[0] | null> {
    console.log("Fetching penilaian logbook detail for:", id);
    return mockPenilaianLogbookStatusList.find((item) => item.id === Number(id)) || null;
  },
};
