import { Storage } from '@core/data/storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOccurenceDto, UpdateOccurenceDto } from '../dtos/occurrenceDTO';
import { IOccurrencesRepository } from '../repositories/occurences-repository.abstract';
import { IUsersRepository } from '@modules/users/repositories/IUsers-repository';
import { EmailService } from '@core/infra/services/email.service';

@Injectable()
export class OccurencesService {
  constructor(
    private readonly occurrencesRepository: IOccurrencesRepository,
    private readonly storage: Storage,
    private readonly usersRepository: IUsersRepository,
    private readonly emailService: EmailService
  ) {}

  async create(userId: string, data: CreateOccurenceDto) {
    const { files } = data;
    let fileNames: string[] = [];
    if (files?.length > 0) {
      const filesOptions = await Promise.all(
        files?.map(async (file) => {
          return await this.storage.uploadFile(file.filename, {
            folderName: userId,
          });
        }),
      );

      fileNames = filesOptions.map((file) => file?.fileName);
    }
    data.latitude = Number(data.latitude);
    data.longitude = Number(data.longitude);
    const newOccurence = await this.occurrencesRepository.create({
      ...data, userId,
      files: fileNames,
    });

    const user = await this.usersRepository.findById(userId)
    if(user.role === 'admin'){
      const usersAlert = await this.usersRepository.findByCepAdress(newOccurence.zipCode)
      usersAlert.map(async (userAlert) => {
        await this.emailService.sendAlertEmail(userAlert.email, userAlert.name)
      })
    }

    return newOccurence;
  }

  async findAll() {
    const occurrences = await this.occurrencesRepository.findAll();
    const parsedOccurrences = await Promise.all(
      occurrences.map(async (occurrence) => {
        const parsedFiles = await Promise.all(
          occurrence.files.map(async (file) => {
            const filePath = await this.storage.getFileUrl(file);
            return {
              filename: file,
              filePath,
            };
          }),
        );

        return {
          ...occurrence,
          files: parsedFiles,
        };
      }),
    );

    return parsedOccurrences;
  }

  async findOne(id: string) {
    const occurrence = await this.occurrencesRepository.findById(id);

    const parsedFiles = await Promise.all(
      occurrence.files.map(async (file) => {
        const filePath = await this.storage.getFileUrl(file);
        return {
          filename: file,
          filePath,
        };
      }),
    );

    return {
      ...occurrence,
      files: parsedFiles,
    };
  }

  async update(id: string, data: UpdateOccurenceDto) {
    const hasOccurrence = await this.occurrencesRepository.findById(id);

    if (!hasOccurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    const updatedOccurrence = await this.occurrencesRepository.update(id, data);
    return updatedOccurrence;
  }

  async remove(id: string) {
    const hasOccurrence = await this.occurrencesRepository.findById(id);
    if (!hasOccurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return await this.occurrencesRepository.delete(id);
  }
}
