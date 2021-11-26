import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

import { APP_INTERCEPTOR } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

import { CurrentUserMiddleware } from '../middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
