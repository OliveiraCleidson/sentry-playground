import { Type } from 'class-transformer';
import { IsDefined, IsNumber, Max, Min } from 'class-validator';

export class QueryPaginationDTO {
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(1000)
  page?: number = 1;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(5)
  @Max(100)
  pageSize?: number = 5;

  calcSkip() {
    return (this.page - 1) * this.pageSize;
  }

  calculeTotalPages(count: number) {
    return Math.ceil(count / this.pageSize);
  }
}
