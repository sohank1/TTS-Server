import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from 'cookie-parser';
import { environment } from "./environment/environment";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["https://tts-app.netlify.app", "http://localhost:4200"],
    credentials: true,
  });

  app.use(cookieParser())
  app.use(
    session({
      secret: "Testing",
      cookie: {
        maxAge: 60 * 1000 * 60 * 24,
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
