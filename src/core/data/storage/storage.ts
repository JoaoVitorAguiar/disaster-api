export type FileOptions = {
  fileName: string;
  basename?: string;
  ext?: string;
  buffer?: Buffer;
};

export type UploadOptions = {
  folderName?: string;
};

export abstract class Storage {
  abstract uploadFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions>;
  abstract updateFile(
    fileName: string,
    newFileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions>;
  abstract deleteFile(fileName: string, options?: UploadOptions): Promise<void>;
  abstract getFileUrl(
    fileName: string,
    options?: UploadOptions,
  ): Promise<string | null>;
  abstract getFile(
    fileName: string,
    options?: UploadOptions,
  ): Promise<FileOptions | null>;
}
