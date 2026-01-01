export interface GetStatsInputDto {
  userId?: string;
  from?: string; // ISO datetime
  to?: string; // ISO datetime
  limit?: number;
}

export interface GetStatsOutputDto {
  gamesPlayed: number;
  highestScore: number;
}
