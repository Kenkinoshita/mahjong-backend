export type GetGameInputDto = {
  gameId: number;
};

export type GetGameOutputDto = {
  id: number;
  groupId: number;
  scores: {
    userId: number;
    point: number;
  }[];
};
