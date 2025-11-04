import * as bcrypt from 'bcrypt';
import { saltOrRounds } from './constants';

export async function createHash(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, saltOrRounds);
}

export async function compare({ plainText, hash }): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}
