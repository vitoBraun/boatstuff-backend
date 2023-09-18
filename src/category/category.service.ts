import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(categoryCata: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        ...categoryCata,
        predecessors: {
          connect: categoryCata.predecessors,
        },
      },
      include: { predecessors: true },
    });
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
