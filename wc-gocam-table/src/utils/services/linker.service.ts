import * as constants from './../constants'
import { CurieUtilService } from './curie-util.service';

export class LinkerService {

    constructor(private curieService: CurieUtilService) {
    }

    getAmigoTerm(goterm: string): string {
        let curieGOTerm = this.curieService.getCurie(goterm);
        return constants.amigoTermUrl + curieGOTerm;
    }

    getGraphView(goModelId: string): string {
        let model = goModelId;
        if (model.includes("http"))
            model = this.curieService.getCurie(goModelId);
        return constants.noctuaGraphViewUrl + model;
    }

    getPubMedAbstract(pmid: string): string {
        if (!pmid) return ''
        const modpmid = pmid.replace("PMID:", "");
        return constants.pubmedUrl + modpmid;
    }

}