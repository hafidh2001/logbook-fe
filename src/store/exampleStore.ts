import { create } from "zustand";

export interface ExampleStoreState {
  modalOpen: boolean;
  exportLoading: boolean;
  selectedExportFormat: string | null;
  turnstileToken: string | null;
  setModalOpen: (open: boolean) => void;
  setExportLoading: (loading: boolean) => void;
  setSelectedExportFormat: (format: string | null) => void;
  setTurnstileToken: (token: string | null) => void;
}

export const useExampleStore = create<ExampleStoreState>((set) => ({
  modalOpen: false,
  exportLoading: false,
  selectedExportFormat: null,
  turnstileToken: null,

  setModalOpen: (open) => set({ modalOpen: open }),
  setExportLoading: (loading) => set({ exportLoading: loading }),
  setSelectedExportFormat: (format) => set({ selectedExportFormat: format }),
  setTurnstileToken: (token) => set({ turnstileToken: token }),
}));
