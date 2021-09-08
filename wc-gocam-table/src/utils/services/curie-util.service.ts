import * as CurieUtil from "@geneontology/curie-util-es5";
import * as constants from './../constants'

export class CurieUtilService {
    ready: boolean = false;
    curie;
    goContext;

    constructor() {
    }

    async setupCurie() {
        const url = constants.curieUrl
        await fetch(url).then((response: Response) => {
            return response.json()
        }).then(data => {
            this.goContext = data;
            const map = CurieUtil.parseContext(this.goContext);
            this.curie = new CurieUtil.CurieUtil(map);
            this.ready = true;
        });
    }

    /**
     * 
     * @param Iri an IRI (e.g. http://identifiers.org/zfin/ZDB-GENE-031112-7, http://identifiers.org/mgi/MGI:34340, etc)
     */
    getCurie(Iri: string): string {
        return this.curie.getCurie(Iri);
    }

    /**
     * Return the IRI of the given CURIE
     * @param Curie a CURIE (e.g. ZFIN:ZDB-GENE-031112-7, MGI:MGI:34340, etc)
     */
    getIri(Curie: string): string {
        return this.curie.getIri(Curie);
    }

    getAmigoTerm(goterm: string): string {
        let curieGOTerm = this.getCurie(goterm);
        return constants.amigoTermUrl + curieGOTerm;
    }


}