import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { FileController } from './file/file.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ProductModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),
  ],
  controllers: [AppController, CategoryController, FileController],
  providers: [
    AppService,
    PrismaService,
    CategoryService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
