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
  size = 0;
  total = 0;
  pageNumber = 0;
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
    this.data = data;;
  }

  getPage(page: number, pageSize: number) {
    const start = page * pageSize;
    const end = page * pageSize + pageSize;
    this.pageData = this.data.slice(start, end);

    return this.pageData
  }
}
