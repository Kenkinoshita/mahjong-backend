export type GetUserForLoginInputDto = {
  email: string;
};

export type GetUserForLoginOutputDto = {
  id: number;
  hashedPassword: string;
};
