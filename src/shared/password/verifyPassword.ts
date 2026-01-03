import { verify } from 'argon2';

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => await verify(hash, password);
