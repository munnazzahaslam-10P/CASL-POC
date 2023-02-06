import { Module } from '@nestjs/common';
import { configModuleOptions } from './env';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(configModuleOptions)
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}