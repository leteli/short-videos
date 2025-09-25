import { Global, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard, VerifyAuthGuard } from 'src/auth/auth.guard';

@Global()
@Module({
  imports: [AuthModule, UsersModule],
  providers: [AuthGuard, VerifyAuthGuard],
  exports: [AuthGuard, VerifyAuthGuard, AuthModule, UsersModule],
})
export class SecurityModule {}
