
import * as constants from './../constants'
import { PMIDArticle } from '../models/pmid-article';

export class PubmedApiService {

  pubmedMetaUrl = constants.pubmedMetaUrl;

  constructor() { }

  getArticle(pmid): Promise<PMIDArticle> {
    pmid = pmid.replace("PMID:", "")
    const url = `${this.pubmedMetaUrl}&id=${pmid}`;
    return fetch(url).then((response: Response) => {
      return response.json()

      //res => res.result[res.result.uids[0]]
    });
  }

}
