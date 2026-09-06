export type LoginInputDto = {
  email: string;
  password: string;
};

export type LoginOutputDto = {
  userId: number;
  accessToken: string;
};
