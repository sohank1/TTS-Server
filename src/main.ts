import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";
import { environment } from "./environment/environment";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
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
  app.enableCors({
    origin: true,
    credentials: true,
  });

  if (process.env.NODE_ENV === 'production')
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
      next();
    });

  await app.listen(environment.PORT);
}
bootstrap();
