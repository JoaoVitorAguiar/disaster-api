import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICategoriesRepository } from '../repositories/categories-repository.abstract';
import { CreateCategoryDto } from '../dtos/categoriesDTO';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: ICategoriesRepository) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      data.name,
    );

    if (categoryAlreadyExists)
      throw new ConflictException('Categoria já existe');

    const newCategory = await this.categoriesRepository.create(data);

    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoriesRepository.findById(id);

    return category;
  }

  async update(id: string, data: CreateCategoryDto): Promise<Category> {
    const hasCategory = await this.categoriesRepository.findById(id);

    if (!hasCategory) throw new NotFoundException('Categoria não existe');

    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      data.name,
    );

    if (categoryAlreadyExists)
      throw new ConflictException('Categoria já existe');

    const updatedCategory = await this.categoriesRepository.update(id, data);

    return updatedCategory;
  }

  async delete(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);

    return;
  }
}
