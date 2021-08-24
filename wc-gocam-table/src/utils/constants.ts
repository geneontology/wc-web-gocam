
export const apiUrl = "https://api.geneontology.cloud/";
export const pubmedMetaUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json"
export const noctuaUrl = "http://noctua.geneontology.org/";
export const noctuaGraphViewUrl = "http://noctua.geneontology.org/editor/graph/";
export const noctuaPathwayViewUrl = "http://noctua.geneontology.org/workbench/pathwayview/?model_id=";
export const amigoUrl = "http://amigo.geneontology.org/";
export const amigoTermUrl = "http://amigo.geneontology.org/amigo/term/";
export const pubmedUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
export const goUrl = "http://geneontology.org/";
export const oboFoundryUrl = "http://www.obofoundry.org/";
export const orcidUrl = "http://orcid.org/";
export const groupContacts = "https://raw.githubusercontent.com/geneontology/go-site/master/metadata/group-contacts.csv";
export const groupMeta = "https://raw.githubusercontent.com/geneontology/go-site/master/metadata/groups.yaml";
export const userMeta = "https://raw.githubusercontent.com/geneontology/go-site/master/metadata/users.yaml";
export const goContext = "https://github.com/prefixcommons/biocontext/blob/master/registry/go_context.jsonld";

export const curieUrl = "https://raw.githubusercontent.com/prefixcommons/biocontext/master/registry/go_context.jsonld";
export const CELLULAR_COMPONENT = "http://purl.obolibrary.org/obo/GO_0005575";
export const MOLECULAR_FUNCTION = "http://purl.obolibrary.org/obo/GO_0003674";
export const BIOLOGICAL_PROCESS = "http://purl.obolibrary.org/obo/GO_0008150";

export const tableColumns = [
  { label: 'Title', hidden: false },
  { label: 'Biological Process', hidden: false },
  { label: 'Molecular Function', hidden: false },
  { label: 'Cellular Component', hidden: false },
  { label: 'Gene Product', hidden: false },
  { label: 'Contributor', hidden: false },
  { label: 'Group', hidden: false },
  { label: 'Date', hidden: false }];
