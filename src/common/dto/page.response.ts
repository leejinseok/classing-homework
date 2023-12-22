export class PageInfo {
  totalCount: number;
  totalPage: number;
  currentPage: number;
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
