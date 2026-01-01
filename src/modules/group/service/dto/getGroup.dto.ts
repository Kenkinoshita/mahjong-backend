export interface GetGroupInputDto {
  groupId: number;
}

export interface GetGroupOutputDto {
  id: number;
  name: string;
  memberIds: number[];
}
