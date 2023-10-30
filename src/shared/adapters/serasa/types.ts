export type ListResultItem = {
  type: 'object' | 'directory';
  name: string;
  size: number;
  modifyTime: Date;
};

export type SendFileCommand = {
  fileName: string;
  destinationPath: string;
  body: Buffer;
};
