import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors();
  app
    .useGlobalPipes
    // new ValidationPipe({
    //   transform: true,
    //   transformOptions: { enableImplicitConversion: true },
    // }),
    ();

  await app.listen(process.env.PORT || 1333);
}
bootstrap();
