type StatusReturn<T> = [data: T, error: Error]

export interface IStorageAdapter {
  createFolder(path: string): Promise<boolean>;
}