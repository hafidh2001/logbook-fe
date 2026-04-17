import { mockRekapLogbook, mockRekapPenilaian, mockRekapReport, mockRekapReportDetail } from "@/data/rekap";

export const rekapApi = {
  async getRekapLogbook() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapLogbook;
  },

  async getRekapLogbookById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapLogbook.find((item) => item.id === Number(id));
  },

  async getRekapPenilaian() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapPenilaian;
  },

  async getRekapPenilaianById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapPenilaian.find((item) => item.id === Number(id));
  },

  async getRekapReport() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapReport;
  },

  async getRekapReportById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRekapReportDetail.find((item) => item.id === Number(id));
  },
};
