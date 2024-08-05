import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as uuid from 'uuid';
import * as fs from 'fs';
import { promisify } from 'util';
import { FileOptions, Storage, UploadOptions } from './storage';
import { FileService } from '@core/infra/services/file.service';

const unlinkAsync = promisify(fs.unlink);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class LocalStorage implements Storage {
  private readonly storageDir = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'tmp',
    'upload',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async uploadFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions> {
    const { ext, basename } = this.fileService.extractFileNameData(fileName);
    const parsedFileName = `${uuid.v4()}_${basename}${ext}`;
    const filePath = path.resolve(FileService.tempDir, fileName);
    const destinationFolder = options?.folderName
      ? path.resolve(this.storageDir, options.folderName)
      : this.storageDir;
    const destination = path.resolve(destinationFolder, parsedFileName);

    try {
      if (!fs.existsSync(destinationFolder)) {
        await mkdirAsync(destinationFolder, { recursive: true });
      }
      await writeFileAsync(destination, await readFileAsync(filePath));
      await this.fileService.unlinkTempFile(fileName);

      return {
        fileName: parsedFileName,
      };
    } catch (err) {
      await this.fileService.unlinkTempFile(fileName);
      throw new BadRequestException(`Erro ao fazer upload do arquivo: ${err}`);
    }
  }

  async updateFile(
    fileName: string,
    newFileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions> {
    await this.deleteFile(fileName, options);
    return await this.uploadFile(newFileName, options);
  }

  async deleteFile(fileName: string, options?: UploadOptions): Promise<void> {
    const parsedFileName = options?.folderName
      ? path.resolve(this.storageDir, options.folderName, fileName)
      : path.resolve(this.storageDir, fileName);

    try {
      await unlinkAsync(parsedFileName);
    } catch (err) {
      throw new BadRequestException(`Erro ao excluir o arquivo: ${err}`);
    }
  }

  async getFileUrl(
    fileName: string,
    options?: UploadOptions,
  ): Promise<string | null> {
    const appUrl = this.configService.get<string>('appUrl');
    if (!appUrl) {
      throw new InternalServerErrorException();
    }
    const parsedFileName = options?.folderName
      ? `${options.folderName}/${fileName}`
      : `${fileName}`;

    return `${appUrl}/file/${parsedFileName}`;
  }

  async getFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions | null> {
    const parsedFileName = options?.folderName
      ? path.resolve(this.storageDir, options.folderName, fileName)
      : path.resolve(this.storageDir, fileName);

    try {
      const fileBuffer = await readFileAsync(parsedFileName);
      const { ext, basename } = this.fileService.extractFileNameData(fileName);

      return {
        fileName,
        buffer: fileBuffer,
        ext,
        basename,
      };
    } catch (err) {
      return null;
    }
  }
}
