import { hash } from 'argon2';

export const hashPassword = async (password: string): Promise<string> => await hash(password);
