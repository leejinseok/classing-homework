import { ApiProperty } from '@nestjs/swagger';

export class PageInfo {
  @ApiProperty({ example: 20 })
  totalCount: number;

  @ApiProperty({ example: 2 })
  totalPage: number;

  @ApiProperty({ example: 0 })
  currentPage: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  constructor(
    totalCount: number,
    totalPage: number,
    currentPage: number,
    pageSize: number,
  ) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = totalPage;
  }
}

export class PageResponse<T> {
  @ApiProperty()
  page: PageInfo;

  list: T[];

  constructor(
    totalCount: number,
    currentPage: number,
    pageSize: number,
    list: T[],
  ) {
    this.page = new PageInfo(
      totalCount,
      Math.ceil(totalCount / pageSize),
      currentPage,
      pageSize,
    );
    this.list = list;
  }
}
