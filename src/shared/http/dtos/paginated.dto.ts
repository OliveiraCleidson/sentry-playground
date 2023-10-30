class PaginatedMetaDto {
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export class PaginatedDto<T = any> {
  constructor(data: PaginatedDto<T>) {
    this.data = data.data;
    this.meta = data.meta;
  }

  data: T[];
  meta: PaginatedMetaDto;

  static getTotalPages(count: number, pageSize: number) {
    return Math.ceil(count / pageSize);
  }
}
