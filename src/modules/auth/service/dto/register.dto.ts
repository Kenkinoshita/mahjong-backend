export type RegisterInputDto = {
  name: string;
  email: string;
  password: string;
};

export type RegisterOutputDto = { accessToken: string; userId: number };
