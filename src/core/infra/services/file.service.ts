import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class FileService {
  static readonly tempDir = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'tmp',
  );

  async unlinkFile(filePath: string): Promise<void> {
    const unlinkAsync = util.promisify(fs.unlink);
    await unlinkAsync(filePath);
  }

  async unlinkTempFile(fileName: string): Promise<void> {
    const filePath = path.join(FileService.tempDir, fileName);
    await this.unlinkFile(filePath);
  }

  extractFileNameData(filePath: string): {
    ext: string;
    basename: string;
  } {
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);

    return { ext, basename };
  }

  getContentType(fileExt: string) {
    switch (fileExt.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      case '.bmp':
        return 'image/bmp';
      case '.svg':
        return 'image/svg+xml';
      default:
        undefined;
    }
  }
}
