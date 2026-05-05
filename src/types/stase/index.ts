export type TStaseListItem = {
  id?: number;
  user: string;
  stase: string;
  date: string;
  notes: string | null;
};

export interface IStaseListParams {
  id_client: number;
  page?: number;
  limit?: number;
  id_ppds?: number | null;
  id_stase?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}
