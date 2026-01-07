import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppExeptionFilter } from './gql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }),);
  app.useGlobalFilters(new AppExeptionFilter())
}
bootstrap();
