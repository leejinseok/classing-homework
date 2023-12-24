import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api/api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalPipes(new ValidationPipe());

  const setUpSwagger = () => {
    const config = new DocumentBuilder()
      .setTitle('Classing homework')
      .setDescription('The Classting homework API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs/index.html', app, document, {});
  };

  setUpSwagger();
  await app.listen(3000);
}
bootstrap();
