import * as Joi from 'joi';
import { config as dotenv } from 'dotenv';
import { IConfig } from './types';

dotenv();

export const configSchema = Joi.object<IConfig, true>({
  PORT: Joi.number().required(),
  DB_URL: Joi.string().required(),
});

export const config: IConfig = {
  PORT: Number(process.env.PORT),
  DB_URL: String(process.env.DB_URL),
};
