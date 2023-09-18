import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(categoryCata: CreateCategoryDto): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data: {
        ...categoryCata,
        predecessors: {
          connect: categoryCata.predecessors,
        },
      },
      include: { predecessors: true },
    });
    const errors = [];
    categoryCata.predecessors?.forEach((predecessor) => {
      if (predecessor.id === createdCategory.id) {
        this.prisma.category.delete({ where: { id: predecessor.id } });
        errors.push(predecessor.id);
      }
    });
    if (errors.length > 0) {
      throw new Error(`Predecessor ${errors} cannot be same as category id`);
    }
    return createdCategory;
  }

  async getCategoriesList(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: { predecessors: true, successors: true },
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
