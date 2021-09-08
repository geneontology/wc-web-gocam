
import { GOCam } from '../models/gocam';
import { GOCamGO } from '../models/gocam-go';
import { GOCamGP } from '../models/gocam-gp';
import { GOCamPMID } from '../models/gocam-pmid';

import * as constants from './../constants';
//import * as utils from './../utils';

export class GoApiService {

  baseUrl = constants.apiUrl;

  constructor() {
  }

  TEMPLIST(): Promise<GOCam[]> {
    const url = "https://s3.amazonaws.com/geneontology-public/gocam/gocam-models.json"
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }

  TEMPLISTGO(): Promise<GOCamGO[]> {
    const url = "https://s3.amazonaws.com/geneontology-public/gocam/gocam-goterms.json"
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }

  TEMPLISTGP(): Promise<GOCamGP[]> {
    const url = "https://s3.amazonaws.com/geneontology-public/gocam/gocam-gps.json"
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }

  TEMPLISTPMID(): Promise<GOCamPMID[]> {
    const url = "https://s3.amazonaws.com/geneontology-public/gocam/gocam-pmids.json"
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }

  /*
  Don't call these for now as we are calling the static json queries
  *
  getModelList(): Promise<GOCam[]> {
    const url = this.baseUrl + 'models'
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }



  getAllModelsGOs(): Promise<GOCamGO[]> {
    return fetch(this.baseUrl + 'models/go/').then((response: Response) => {
      return response.json()
    });
  }

  getAllModelsGPs(): Promise<GOCamGP[]> {
    return fetch(this.baseUrl + 'models/gp/').then((response: Response) => {
      return response.json()
    });
  }

 
  getModelsPMIDs(gocams): Promise<GOCamPMID[]> {
    if (!gocams) {
      return this.getAllModelsPMIDs();
    }
    const gocamString = gocams.reduce(utils.concat);

    const url = this.baseUrl + 'models/pmid?gocams=' + gocamString
    return fetch(url).then((response: Response) => {
      return response.json()
    });
  }

  getAllModelsPMIDs(): Promise<GOCamPMID[]> {
    return fetch(this.baseUrl + 'models/pmid/').then((response: Response) => {
      return response.json()
    });
  }
  */
  /* 
    getModelListRange(start: number, size: number): Observable<GOCam[]> {
      return this.httpClient.get<[GOCam]>(this.baseUrl + "models?start=" + start + "&size=" + size)
        .map(res => res);
    }
  
    getMostRecents(nb: number): Observable<GOCam[]> {
      return this.httpClient.get<[GOCam]>(this.baseUrl + 'models?last=' + nb)
        .map(res => res);
    }
  
    getGroupModelList(group: string): Observable<GOCam[]> {
      return this.httpClient.get<[GOCam]>(this.baseUrl + 'models?group=' + group)
        .map(res => res);
    }
  
    getUserModelList(user: string): Observable<GOCam[]> {
      return this.httpClient.get<[GOCam]>(this.baseUrl + 'models?user=' + user)
        .map(res => res);
    }
  
    getPMIDModelList(pmid: string): Observable<GOCam[]> {
      return this.httpClient.get<[GOCam]>(this.baseUrl + 'models?pmid=' + pmid)
        .map(res => res);
    }
  
  
    models = [];
    getStaticModelList() {
      this.getModelList().subscribe(data => {
        var json = JSON.parse(JSON.stringify(data));
        json = json._body;
        json = JSON.parse(json);
        json.map(res => {
          this.models.push(res);
        });
        return this.models;
      });
    }
  
  
  
    /**
     * Return meta data on GO-Terms associated to a list of gocams
     * @param gocams a list of gocams . If null, send the GO-Terms to all GO-CAMs
     *
    getModelsGOs(gocams: string[]): Observable<GOCamGO[]> {
      if (!gocams) {
        return this.getAllModelsGOs();
      }
      console.log("asking to retrieve some GOs (" + gocams + ")");
      var gocamString = gocams.reduce(this.utils.concat);
      return this.httpClient.get<GOCamGO[]>(this.baseUrl + "models/go?gocams=" + gocamString)
        .map(res => res);
    }
  

  
  
    /**
     * Return meta data on Gene Products associated to a list of gocams
     * @param gocams a list of gocams . If null, send the GO-Terms to all GO-CAMs
     *
    getModelsGPs(gocams: string[]): Observable<GOCamGP[]> {
      if (!gocams) {
        return this.getAllModelsGPs();
      }
      var gocamString = gocams.reduce(this.utils.concat);
      return this.httpClient.get<GOCamGP[]>(this.baseUrl + "models/gp?gocams=" + gocamString)
        .map(res => res);
    }
  

  
  
    getUserList(): Observable<object> {
      return this.httpClient.get(this.baseUrl + "users")
        .map(res => res);
    }
  
    getUserMetaData(orcid: string): Observable<object> {
      var checkedOrcid = this.utils.extractORCID(orcid);
      return this.httpClient.get(this.baseUrl + "users/" + orcid)
        .map(res => res);
    }
  
    getUserModels(orcid: string): Observable<object> {
      var checkedOrcid = this.utils.extractORCID(orcid);
      return this.httpClient.get(this.baseUrl + "users/" + orcid + "/models")
        .map(res => res);
    }
  
    getUserGPs(orcid: string): Observable<object> {
      var checkedOrcid = this.utils.extractORCID(orcid);
      return this.httpClient.get(this.baseUrl + "users/" + orcid + "/gp")
        .map(res => res);
    }
  
    getGroupMetaData(shorthand: string) {
      return this.httpClient.get(this.baseUrl + "groups/" + shorthand)
        .map(res => res);
    }
   */


}

