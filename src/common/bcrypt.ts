import * as bcrypt from 'bcrypt';
import { saltOrRounds } from './constants';

export async function createHash(plainText: string) {
  return await bcrypt.hash(plainText, saltOrRounds);
}

export async function compare({ plainText, hash }) {
  return await bcrypt.compare(plainText, hash);
}
