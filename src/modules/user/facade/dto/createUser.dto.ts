export type CreateUserInputDto = {
  name: string;
  email: string;
  hashedPassword: string;
};

export type CreateUserOutputDto = {
  id: number;
};
