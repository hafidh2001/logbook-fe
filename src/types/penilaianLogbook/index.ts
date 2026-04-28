export type TPenilaianLogbook = {
  id: number;
  name: string;
  unscored: number;
  scored: number;
};

export interface IPenilaianLogbookListParams {
  id_client: number;
}

export interface IPenilaianLogbookDetailParams {
  id_action: number;
}
