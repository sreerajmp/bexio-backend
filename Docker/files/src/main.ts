import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
 import { swaggerOptions, swaggerTitle, swaggerDescription } from './common';
 import * as cookieParser from 'cookie-parser';
 import config from './common/config/index';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger Configuration --------------------------------


  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  SwaggerModule.setup('api', app, document, swaggerOptions);

  // End Swagger Configurations --------------------------------
  
  app.use(cookieParser(config.SESSION_SECRET));
  //Enable CORS
  app.enableCors();


  await app.listen(3000);
  Logger.log(`App running on Port 3000`);


}
bootstrap();


