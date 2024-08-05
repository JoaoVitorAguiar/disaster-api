import { Injectable } from '@nestjs/common';
import { ICategoriesRepository } from '../categories-repository.abstract';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@modules/categories/dtos/categoriesDTO';
import { Category } from '@prisma/client';
import { PrismaService } from '@core/data/prisma/prisma.service';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.prisma.category.create({ data });

    return newCategory;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data,
    });

    return updatedCategory;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();

    return categories;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { name },
    });

    return category;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    return category;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });

    return;
  }
}
