import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config, configSchema } from './common/config';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


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
