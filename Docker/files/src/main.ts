import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions, swaggerTitle, swaggerDescription } from './common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import config from './common/config/index';
import * as express from 'express';
import redisClient from './common/utils/redisDB';
import { RedisStore } from 'connect-redis';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(config.SESSION_SECRET));
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: config.SESSION_COOKIE_NAME || 'nestjs.session', 
      cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production
        httpOnly: true,
        maxAge: config.SESSION_EXPIRY || 86400000, // Default: 1 day
        domain: config.SESSION_DOMAIN || undefined,
        sameSite: 'lax'
      },
    })
  );
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  if (process.env.NODE_ENV === 'development') {
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

    // Enable CORS for localhost and dev URLs
    app.enableCors({
      origin: [
        'http://localhost:3000',
        /^http:\/\/local-bexio\.io-market\.net(:[0-9]+)?$/,
        'https://local-bexio.io-market.net:3000',
        config.BEXIO_APP_URL,
        config.BILLING_URL
      ],
      credentials: true,
    });
  } else {
    // Production: restrict CORS as needed (example: only allow main app URL)
    app.enableCors({
      origin: [config.BEXIO_APP_URL, config.BILLING_URL],
      credentials: true,
    });
  }

  app.use(express.json()); // Enables JSON parsing
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.SESSION_SECRET));
  console.log('config.BEXIO_APP_URL', config.BEXIO_APP_URL);

  await app.listen(3001);
  Logger.log(`App running on Port 3001`);


}
bootstrap();


