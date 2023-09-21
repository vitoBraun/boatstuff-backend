import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Subcategory } from '@prisma/client';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
} from './dto/create.category.dto';
import { AuthGuard } from 'src/users/auth.middleware';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
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

  @Post('subcategory')
  @UseGuards(AuthGuard)
  async createSubcategory(
    @Body()
    subcategoryData: CreateSubcategoryDto,
  ): Promise<Category> {
    return await this.categoryService
      .createSubcategory(subcategoryData)
      .catch((error) => {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get('list')
  async getList(): Promise<Category[]> {
    return this.categoryService.getCategoriesList();
  }

  @Get('subcategory/list')
  async getSubcategoryList(
    @Query('categoryId') categoryId?: string,
  ): Promise<Subcategory[]> {
    return this.categoryService.getSubcategoriesList(Number(categoryId));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
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
  @Delete('subcategory/:id')
  @UseGuards(AuthGuard)
  async deleteSubcategory(@Param('id') id: string) {
    return await this.categoryService
      .deleteSubcategory(Number(id))
      .catch(() => {
        throw new HttpException(
          {
            message: 'Bad request, probably not existed category',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
