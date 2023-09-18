import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { FileController } from './file/file.controller';

@Module({
  imports: [ProductModule],
  controllers: [AppController, CategoryController, FileController],
  providers: [AppService, PrismaService, CategoryService],
})
export class AppModule {}
