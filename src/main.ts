import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { environment } from "./environment/environment";
import { NestExpressApplication } from '@nestjs/platform-express';
import { NotFoundExceptionFilter } from './not-found-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.enableCors({ origin: ['http://localhost:4200', 'https://tts-api-prod.herokuapp.com'], credentials: true });

  app.use(cookieParser())
  app.use(
    session({
      secret: "Testing",
      cookie: {
        maxAge: 60 * 1000 * 60 * 24
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(environment.PORT);
}
bootstrap();
