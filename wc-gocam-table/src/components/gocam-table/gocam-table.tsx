import { Component, h, Listen, Prop, State, Watch } from '@stencil/core';
import { GOCam } from '../../utils/models/gocam';
import { GOCamTableModel, GOTableDataSource, Page, TableColumn } from '../../utils/models/gocam-table';
import { CurieUtilService } from '../../utils/services/curie-util.service';
import { GoApiService } from '../../utils/services/go-api.service';
import { LinkerService } from '../../utils/services/linker.service';
import { PubmedApiService } from '../../utils/services/pubmed-api.service';
import * as constants from './../../utils/constants'
import * as utils from './../../utils/utils';

@Component({
  tag: 'wc-gocam-table',
  styleUrl: 'gocam-table.scss',
  assetsDirs: ['assets'],
  shadow: false,
})
export class CamTable {
  pubmedApiService = new PubmedApiService();
  curieService = new CurieUtilService();
  goApiService = new GoApiService();
  linkerService;

  isLoading: boolean = true;
  isBufferLoading: boolean = true;
  pageSizes = [10, 25, 100];

  @Prop()
  keyword

  @Prop()
  paginationClass: string

  @Watch('keyword')
  filterByKeyword(newValue, oldValue) {
    const isNotString = typeof newValue !== 'string';
    if (isNotString) { throw new Error('keyword: not string') };
    if (newValue !== oldValue) {
      this.applyFilter(newValue)
    }
  }

  @State()
  dataSource: GOTableDataSource<GOCamTableModel>;

  @State()
  pageNumber: number = 0;

  @State()
  pageSize: number = 0;

  @Listen('pageChanged', { target: 'document' })
  handlePageSelected(event: CustomEvent) {
    this.pageNumber = event.detail;
    this.dataSource.getPage(this.pageNumber)
    this.updatePaginator(this.dataSource.page)
  }

  @Listen('sizeChanged', { target: 'document' })
  handleSizeChanged(event: CustomEvent) {
    this.pageSize = event.detail;
    this.dataSource.changeSize(this.pageSize)
    this.dataSource.getPage(0)
    this.updatePaginator(this.dataSource.page)
  }

  models = [];


  componentWillLoad() {
    this.curieService.setupCurie().then(() => {
      //const initialSize = this.pageSizes[0];
      this.linkerService = new LinkerService(this.curieService)
      this.goApiService.TEMPLIST().then((gocamsRes: GOCam[]) => {
        gocamsRes.map(res => {
          this.models.push(res);
        })

        // const gocams = this.extractModels(gocamsRes);
        //gocams.length = initialSize;
        this.fillWithGOs();
      });
    })
  }

  /**
   * Fill the Table with GO-Terms meta data
   * @param gocams a list of GO-CAMs. If null, will search for GO-Terms for all GO-CAMs
   * @param callback callback function to launch when this task is done. Can be null
   */
  fillWithGOs(gocams?) {
    if (gocams != null) {
      return;
    }
    this.goApiService.TEMPLISTGO().then(json => {
      var tabelt;
      json.forEach(element => {
        tabelt = this.models.find(item => { return item.gocam == element.gocam });
        if (tabelt) {
          tabelt.bp = this.extractGOs(element, constants.BIOLOGICAL_PROCESS);
          tabelt.mf = this.extractGOs(element, constants.MOLECULAR_FUNCTION);
          tabelt.cc = this.extractGOs(element, constants.CELLULAR_COMPONENT);
        } else {
          // console.warn("gocam <" + element.gocam + "> does not seem to have GO-Terms");
        }
      });
      //      console.log("fillWithGOs(" + gocams + "): done");
      this.fillWithGPs(gocams);
    });
  }

  /**
   * Fill the Table with Gene Products meta data
   * @param gocams a list of GO-CAMs. If null, will search for Gene Products for all GO-CAMs 
   * @param callback callback function to launch when this task is done. Can be null
   */
  fillWithGPs(gocams) {
    if (gocams != null) {
      return;
    }

    //    console.log("fillWithGPs(" + gocams + "): start");
    this.goApiService.TEMPLISTGP().then(json => {
      var tabelt;
      json.forEach(element => {
        tabelt = this.models.find(item => { return item.gocam == element.gocam });
        if (tabelt) {
          tabelt.gp = this.extractGPs(element);
        } else {
          // console.warn("gocam <" + element.gocam + "> does not seem to have Gene Products");
        }
      });
      this.fillWithPMIDs(gocams);
    });
  }

  /**
   * Fill the Table with Gene Products meta data
   * @param gocams a list of GO-CAMs. If null, will search for Gene Products for all GO-CAMs 
   * @param callback callback function to launch when this task is done. Can be null
   */
  fillWithPMIDs(gocams) {
    if (gocams != null) {
      return null;
    }

    this.goApiService.TEMPLISTPMID().then(json => {
      var tabelt;
      json.forEach(element => {
        tabelt = this.models.find(item => { return item.gocam == element.gocam });
        if (tabelt) {
          tabelt.pmid = this.extractPMIDs(element);
        } else {
          // console.warn("gocam <" + element.gocam + "> does not seem to have PMIDs");
        }
      });/* 
      if (gocams == null) {
        this.cache.setDetailedModels(this.models);
      } */
      this.createSearchField();
      this.initializeTable(gocams != null);
    });
  }

  updatePaginator(page: Page) {
    if (!this.paginationClass) return;
    const paginators = document.querySelectorAll<HTMLElement>(`.${this.paginationClass}`);

    paginators.forEach(paginator => {
      paginator.setAttribute('page-number', page.pageNumber.toString())
      paginator.setAttribute('page-size', page.size.toString())
      paginator.setAttribute('item-count', page.total.toString())
    });

  }

  initializeTable(isBufferLoading: boolean) {
    // this.page.size = 
    this.dataSource = new GOTableDataSource<GOCamTableModel>(this.models);
    this.dataSource.columns = constants.tableColumns;
    this.setFilterPredicates();
    this.applyFilter(this.keyword);
    this.isLoading = false;
    this.isBufferLoading = isBufferLoading;
  }

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.dataSource.filter = undefined;
      this.dataSource.filterData()
      this.updatePaginator(this.dataSource.page)
      return;
    }
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterData()
    this.updatePaginator(this.dataSource.page)
  }

  /** 
  * Create the Search Field to enable User Search
  * Note: this is a synchroneous method
  */
  createSearchField() {
    this.models.forEach(tabelt => {

      let gocamid = "gomodel:" + this.curieService.getCurie(tabelt.gocam);
      let state = tabelt.state ? tabelt.state : "";

      tabelt.searchfield = tabelt.gocam + " " + gocamid + " " + state;

      if (tabelt.title && tabelt.title.length > 0) {
        tabelt.searchfield += tabelt.title + " ";
      }
      if (tabelt.date && tabelt.date.length > 0) {
        tabelt.searchfield += tabelt.date + " ";
      }

      if (tabelt.names && tabelt.names.length > 0) {
        tabelt.names.forEach(elt => {
          tabelt.searchfield += "u:" + elt + " ";
        });
      }
      if (tabelt.orcids && tabelt.orcids.length > 0) {
        tabelt.orcids.forEach(elt => {
          tabelt.searchfield += "o:" + elt + " ";
        });
      }
      if (tabelt.groupnames && tabelt.groupnames.length > 0) {
        tabelt.groupnames.forEach(elt => {
          tabelt.searchfield += "g:" + elt + " ";
        });
      }

      if (tabelt.bp && tabelt.bp.length > 0) {
        tabelt.bp.forEach(elt => {
          tabelt.searchfield += elt.name + " " + elt.id + " " + elt.id.replace("_", ":");
        });
      }
      if (tabelt.mf && tabelt.mf.length > 0) {
        tabelt.mf.forEach(elt => {
          tabelt.searchfield += elt.name + " " + elt.id + " " + elt.id.replace("_", ":");
        });
      }
      if (tabelt.cc && tabelt.cc.length > 0) {
        tabelt.cc.forEach(elt => {
          tabelt.searchfield += elt.name + " " + elt.id + " " + elt.id.replace("_", ":");
        });
      }
      if (tabelt.gp && tabelt.gp.length > 0) {
        tabelt.gp.forEach(elt => {
          tabelt.searchfield += elt.fullName + " " + elt.id;
        });
      }
      if (tabelt.pmid && tabelt.pmid.length > 0) {
        tabelt.pmid.forEach(elt => {
          tabelt.searchfield += elt.pmid + " ";
        });
      }

      tabelt.searchfield = tabelt.searchfield.toLowerCase();
    })
  }

  /** 
  * Change how the filter is applied
  */
  setFilterPredicates() {
    this.dataSource.filterPredicate =
      (data, filters: string) => {

        const columns = data.searchfield.split(" ");
        const matchFilter = [];

        if (filters.includes(" or ")) {
          const filterArray = filters.toLowerCase().split(" or ");
          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.includes(filter)));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
          return matchFilter.some(Boolean); // AND

        } else {
          const filterArray = filters.toLowerCase().split(" ");
          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.includes(filter)));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
          return matchFilter.every(Boolean); // AND
        }
      }
  }

  extractGOs(gocam, RootTerm) {
    var gos = [];
    var set = new Set();
    for (var i = 0; i < gocam.goclasses.length; i++) {
      if (gocam.goclasses[i] == RootTerm) {
        // should not be necessary, but I have seen some CCs duplicated
        if (set.has(gocam.goids[i]))
          continue;
        set.add(gocam.goids[i]);
        gos.push({
          id: gocam.goids[i],
          name: gocam.gonames[i],
          definition: gocam.definitions[i]
        });
      }
    }
    return gos.sort(this.compare);
  }

  extractGPs(gocam) {
    var gps = [];
    for (var i = 0; i < gocam.gpnames.length; i++) {
      if (!gocam.gpids[i]) {
        // I have made that a silent warning, since this is a problem with NEO:
        // https://github.com/geneontology/neo/issues/32
        // console.error("warning, gocam gp without id !", gocam);
        continue;
      }
      gps.push({
        id: gocam.gpids[i].replace("MGI:MGI", "MGI"),
        name: gocam.gpnames[i].indexOf("uniprot/") != -1 ? gocam.gpnames[i].substring(gocam.gpnames[i].lastIndexOf("/") + 1) : gocam.gpnames[i].substring(0, gocam.gpnames[i].lastIndexOf(" ")),
        species: gocam.gpnames[i].substring(gocam.gpnames[i].lastIndexOf(" ") + 1),
        fullName: gocam.gpnames[i].indexOf("uniprot/") != -1 ? gocam.gpnames[i].substring(gocam.gpnames[i].lastIndexOf("/") + 1) : gocam.gpnames[i]
      });
    }
    return gps.sort(this.compare);
  }

  extractPMIDs(gocam) {
    var pmids = [];
    for (var i = 0; i < gocam.sources.length; i++) {
      pmids.push({
        pmid: gocam.sources[i],
      });
    }
    return pmids.sort(this.compare);
  }

  simplifyNames(names: string[]) {
    var snames = [];
    for (var i = 0; i < names.length; i++) {
      snames[i] = utils.simplifyName(names[i]);
    }
    return snames;
  }

  extractModels(models) {
    return models.map(elt => this.extractModel(elt));
  }

  extractModel(model) {
    if (model.gocam.indexOf("gomodel:") != -1) {
      return model.gocam.substring(model.gocam.lastIndexOf(":") + 1);
    } else {
      return model.gocam.indexOf("/") != -1 ? model.gocam.substring(model.gocam.lastIndexOf("/") + 1) : model.gocam
    }
  }

  correctGOTerms(json) {
    console.log(json);
    var bpMap = new Map();

    var results = [];
    json.map(elt => {
      if (!bpMap.has(elt.goids)) {
        bpMap.set(elt.goids, elt);
      }
    });
    console.log(bpMap);
    return results;
  }

  /*   getModels(event: Page) {
      return this.models.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
    } */


  bpToolTip(bp) {
    return bp.definition;
  }

  mfToolTip(mf) {
    return mf.definition;
  }

  compare(a, b) {
    if (a.id < b.id) {
      return 1;
    }
    return -1;
  }


  articleTooltip = "Please wait...";
  alreadyFetching = false;

  overpmid(pmid) {
    if (this.alreadyFetching)
      return;

    this.alreadyFetching = true;
    this.articleTooltip = "Please wait...";

    // console.log("asked to fetch (" + pmid +  ")" )
    setTimeout(() => {
      // this.articleTooltip = pmid;
      this.alreadyFetching = false;
    }, 1000)

    this.pubmedApiService.getArticle(pmid)
      .then(data => {
        // console.log("PUBMED RETRIEVED: ", data)
        let authors = data.authors[0].name;
        if (data.authors.length > 0)
          authors = data.authors[0].name + " et al."
        this.articleTooltip = data.title + " -- " + authors + " (" + data.source + ", " + data.pubdate + ")";
        this.alreadyFetching = false;
        // console.log("AND TOOLTIP: ", this.articleTooltip);
      }, error => {
        console.log("Could not retrieve data from PubMed ! ", error);
        this.articleTooltip = pmid + " (PubMed API Currently Unavailable)";
      })
  }

  changeSelection(event) {
    console.log("change: ", event.value);
    //this.displayedColumns = event.value;
  }



  coloredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: '5px'
      }}
    />
  );

  render() {
    if (!this.dataSource) {
      return "";
    }

    return (
      <div>
        <table class="table">
          {this.renderHeader(this.dataSource.columns)}
          {this.renderRows(this.dataSource.pageData)}
        </table>
      </div>
    );
  }

  renderHeader(columns: TableColumn[]) {
    return <tr class="table__header">
      {
        columns.map(column => {
          return [
            column.hidden ?
              "" : <th class="table__header__cell">{column.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows(rows) {
    return (
      rows?.map(row => {
        return [
          <tr>
            {this.renderTitleCell(row)}
            {this.renderTermCell(row, constants.TermCategory.BP)}
            {this.renderTermCell(row, constants.TermCategory.MF)}
            {this.renderTermCell(row, constants.TermCategory.CC)}
            {this.renderGPCell(row)}
            {this.renderContributorCell(row)}
            {this.renderGroupCell(row)}
            {this.renderDateCell(row)}
          </tr>]
      })
    )
  }

  renderTitleCell(row) {
    return (
      <td class="goc-cell goc-column-title">
        <div class="row__title">
          <div class="row__title__content">
            <a href={this.linkerService.getGraphView(row.gocam)} target="blank" class="row__title__link">{row.title} &nbsp;
              <coloredLine color="red" />
            </a>
            <div class="row__articles__container">
              <div class="row__articles__container__citation">Citations:</div>
              <span class="row__article"> {
                row.pmid?.map(source => {

                  return [
                    <a href={this.linkerService.getPubMedAbstract(source.pmid)} target="_blank">
                      {source.pmid}
                    </a>
                  ]
                })
              }
              </span>
            </div>
          </div>
          <div class="row__title__actions">
            <a href={this.linkerService.getGraphView(row.gocam)} target="blank">
              <button goc-button class="button-open">
                <span>View</span>
              </button>
            </a>
          </div >
        </div >
      </td >
    )
  }

  renderTermCell(row, termType) {
    if (!row[termType]) {
      return <td class="goc-cell"></td>
    }

    const cellClass = `table-button color-${termType}`

    return (
      <td class="goc-cell goc-column-term">
        <div class="u-width-full">
          <span>{
            row[termType].map(term => {
              return [
                <a href={this.linkerService.getAmigoTerm(term.id)} target="_blank" title={term.definition} class={cellClass}>
                  {term.name}
                </a>
              ]
            })
          }
          </span>
        </div>
      </td>
    )
  }

  renderGPCell(row) {
    if (!row.gp) {
      return <td class="goc-cell"></td>
    }

    return (
      <td class="goc-cell goc-column-term">
        <div class="u-width-full">
          <span>{
            row.gp.map(term => {
              return [
                <a href={term.id} target="_blank" title={term.definition} class="table-button color-gp">
                  {term.fullName}
                </a>
              ]
            })
          }
          </span>
        </div>
      </td>
    )
  }

  renderGroupCell(row) {
    return (
      <td class="goc-cell goc-column-contributor">
        <span>{
          row.groupnames.map(name => {
            return [
              <a target="_blank" class="a-vertical-displacement a-font-weight">
                {name}
              </a>
            ]
          })
        }
        </span>
      </td>
    )
  }

  renderContributorCell(row) {
    return (
      <td class="goc-cell goc-column-group">
        <span>{
          row.names.map(name => {
            return [
              <a target="_blank" class="a-vertical-displacement a-font-weight">
                {name}
              </a>
            ]
          })
        }
        </span>
      </td>
    )
  }

  renderDateCell(row) {
    return (
      <td class="goc-cell  goc-column-date">
        <span class="">{row.date}</span>
      </td>
    )
  }

}





