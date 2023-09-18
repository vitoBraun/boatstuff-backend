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
    return await this.categoryService
      .createCategory(productData)
      .catch((error) => {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get('list/:level?')
  async getList(@Param('level') level: string): Promise<Category[]> {
    if (!level) {
      return this.categoryService.getCategoriesList();
    }
    return this.categoryService.getCategoriesList(Number(level));
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
