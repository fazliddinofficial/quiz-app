import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config, configSchema } from './common/config';
import { BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  const { error } = configSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false
  });

  if (error) {
    throw new BadRequestException('Something is wrong config module!')
  }

  await app.listen(config.PORT, () => {
    console.log(`Server is up and running localhost:${config.PORT}`)
  });
}
bootstrap();
