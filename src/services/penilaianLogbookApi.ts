import { mockPenlaianLogbookList, mockPenilaianLogbookStatusList } from "@/data/penilaianLogbook";

export const penilaianLogbookApi = {
  async getPenilaianLogbookList() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPenlaianLogbookList;
  },

  async getPenilaianLogbookStatusList() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPenilaianLogbookStatusList;
  },

  async getPenilaianLogbookDetailById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPenilaianLogbookStatusList.find((item) => item.id === Number(id)) || null;
  },

  async scorePenilaianLogbook(id: string, data: { psikomotor: number; knowledge: number; afektif: number }) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Scoring penilaian logbook:", id, data);
  },
};
