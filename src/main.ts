import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const list = errors.map((error) => {
          return error.toString();
        });
        console.error(`Validation errors: ` + list.join(' - '));
        const { value, property } = errors[0];
        throw new Error(`Error with validation - value: ${value}, property: ${property}`);
      },
    }),
  );

  const port = process.env.PORT || '3000';
  await app.listen(port);
  console.log('Server started on port ' + port);
}
bootstrap();
