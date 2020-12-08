import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ session: true })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
