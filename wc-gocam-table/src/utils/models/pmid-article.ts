export class PMIDArticle {
  uid: string;
  pubdate: string;
  epubdate: string;
  source: string;
  authors: [{
    name: string;
    authtype: string;
    clusterid: string;
  }];
  lastauthor: string;
  title: string;
  issn: string;
  essn: string;
  pubtype: [string];
  recordstatus: string;
  pubstatus: string;
  articleids: [{
    idtype: string;
    idtypen: number;
    value: string;
  }];
  fulljournalname: string;
  elocationid: string;
}