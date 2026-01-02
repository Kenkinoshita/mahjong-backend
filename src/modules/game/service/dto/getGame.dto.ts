export interface GetGameInputDto {
  gameId: number;
}

export interface GetGameOutputDto {
  id: number;
  groupId: number;
  scores: {
    userId: number;
    point: number;
  }[];
}
