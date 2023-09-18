import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create.category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body()
    productData: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(productData);
  }

  @Get('list')
  async getList(): Promise<Category[]> {
    return this.categoryService.getCategoriesList();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(Number(id)).catch(() => {
      throw new HttpException(
        {
          message: 'Bad request, probably not existed category',
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
