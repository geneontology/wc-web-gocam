export interface GOCamTableModel {
  gocam: string;
  date: string;
  title: string;
  orcids: string[];
  names: string[];
  groupids: string[];
  groupnames: string[];
  bp: [{
    id: string,
    name: string,
    definition: string
  }],
  mf: [{
    id: string,
    name: string,
    definition: string
  }],
  searchfield: string
  //  bpids: string[];
  //  bpnames: string[];
  //  mfids: string[];
  //  mfnames: string[];
}

export class Page {
  size = 10;
  total = 0;
  pageNumber = 0;

  constructor() {

  }
}

export interface TableColumn {
  label: string;
  id?: string;
  hidden?: boolean;
}


export class GOTableDataSource<T> {

  page = new Page()

  columns: TableColumn[] = []
  filteredData: T[];
  data: T[];
  pageData: T[]
  filter: string;
  filterPredicate: (data: any, filters: string) => boolean;

  constructor(data: T[]) {
    this.data = data;
  }

  getPage(pageNumber: number) {
    this.page.pageNumber = pageNumber
    const start = pageNumber * this.page.size;
    const end = pageNumber * this.page.size + this.page.size;
    this.pageData = this.filteredData.slice(start, end);

    return this.pageData
  }

  changeSize(pageSize: number) {
    this.page.size = pageSize;
    this.page.pageNumber = 0;
  }

  filterData() {
    if (!this.filter || this.filter === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(obj => this.filterPredicate(obj, this.filter));
    }

    this.page.total = this.filteredData.length;

    this.getPage(0)

    return this.filteredData;
  }
}
