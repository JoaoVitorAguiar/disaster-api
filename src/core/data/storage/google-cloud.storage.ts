import { Config } from '@core/infra/config/configuration';
import { Bucket, Storage as GCStorage } from '@google-cloud/storage';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as uuid from 'uuid';
import { FileOptions, Storage, UploadOptions } from './storage';
import { FileService } from '@core/infra/services/file.service';

@Injectable()
export class GoogleCloudStorage implements Storage {
  private readonly gcStorate;
  private readonly bucket: Bucket;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly fileService: FileService,
  ) {
    const googleCloudConfig =
      this.configService.get<Config['googleCloud']>('googleCloud');
    if (!googleCloudConfig) {
      throw new InternalServerErrorException();
    }
    this.gcStorate = new GCStorage({
      projectId: googleCloudConfig.projectId,
      keyFilename: googleCloudConfig.storageKey,
    });
    this.bucket = this.gcStorate.bucket(googleCloudConfig.storageBucketName);
  }

  async uploadFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions> {
    const appUrl = this.configService.get<Config['appUrl']>('appUrl');
    if (!appUrl) {
      throw new InternalServerErrorException();
    }
    const { ext, basename } = this.fileService.extractFileNameData(fileName);
    const parsedFileName = `${uuid.v4()}_${basename}${ext}`;
    const filePath = path.resolve(FileService.tempDir, fileName);
    const destination = options?.folderName
      ? `${options.folderName}/${parsedFileName}`
      : `${parsedFileName}`;

    try {
      await this.bucket.upload(filePath, {
        preconditionOpts: { ifGenerationMatch: 0 },
        destination,
      });

      this.fileService.unlinkTempFile(fileName);

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
    const parsedFileName = options?.folderName
      ? `${options.folderName}/${fileName}`
      : `${fileName}`;

    const [[file]] = await this.bucket.getFiles({
      prefix: parsedFileName,
    });
    if (!file) {
      throw new BadRequestException(`Arquivo "${fileName}" não encontrado`);
    }

    await file.delete();

    return await this.uploadFile(newFileName, options);
  }

  async deleteFile(fileName: string, options?: UploadOptions): Promise<void> {
    const parsedFileName = options?.folderName
      ? `${options.folderName}/${fileName}`
      : `${fileName}`;
    await this.bucket.file(parsedFileName).delete();
  }

  async getFileUrl(
    fileName: string,
    options?: UploadOptions,
  ): Promise<string | null> {
    const appUrl = this.configService.get<Config['appUrl']>('appUrl');
    if (!appUrl) {
      throw new InternalServerErrorException();
    }
    const parsedFileName = options?.folderName
      ? `${options.folderName}/${fileName}`
      : `${fileName}`;

    const file = this.bucket.file(parsedFileName);

    return file
      ? `${appUrl}/file/${options?.folderName ? `${options.folderName}/${parsedFileName}` : parsedFileName}`
      : null;
  }

  async getFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions | null> {
    const parsedFileName = options?.folderName
      ? `${options.folderName}/${fileName}`
      : `${fileName}`;

    const [[file]] = await this.bucket.getFiles({
      prefix: parsedFileName,
    });

    if (!file) {
      return null;
    }

    const [fileBuffer] = await file.download();
    const { ext, basename } = this.fileService.extractFileNameData(file.name);

    return {
      fileName: file.name,
      buffer: fileBuffer,
      ext,
      basename,
    };
  }
}
