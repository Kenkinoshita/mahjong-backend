export type GetStatsInputDto = {
  userId?: string;
  from?: string; // ISO datetime
  to?: string; // ISO datetime
  limit?: number;
};

export type GetStatsOutputDto = {
  rank: number;
  name: string;
  point: number;
  gameCount: number;
  averageRank: number;
  topRate: number;
  avoidLastRate: number;
  rentaiRate: number;
};

export type GetOverallStatsOutputDto = {
  rank: number;
  name: string;
  point: number;
  gameCount: number;
  averageRank: number;
  topRate: number;
  avoidLastRate: number;
  rentaiRate: number;
}[];
