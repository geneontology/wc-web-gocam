import { Component, h, State } from '@stencil/core';
import { GOCam } from '../../utils/models/gocam';
import { GOCamTableModel, GOTableDataSource, TableColumn } from '../../utils/models/gocam-table';
import { CurieUtilService } from '../../utils/services/curie-util.service';
import { GoApiService } from '../../utils/services/go-api.service';
import { PubmedApiService } from '../../utils/services/pubmed-api.service';
import * as constants from './../../utils/constants'
import * as utils from './../../utils/utils';

@Component({
  tag: 'wc-gocam-table',
  styleUrl: 'gocam-table.scss',
  shadow: false,
})
export class CamTable {
  pubmedApiService = new PubmedApiService();
  curieService = new CurieUtilService();
  goApiService = new GoApiService();


  isLoading: boolean = true;
  isBufferLoading: boolean = true;
  date = new Date();
  showDevModels: boolean = false;
  showReviewModels: boolean = false;
  pageSizes = [10, 25, 100];

  @State()
  dataSource: GOTableDataSource<GOCamTableModel>;

  models = [];

  searchFilter: string = undefined;


  componentWillLoad() {
    // notes: 
    // - this is a first pass, loading only the models of the first page for fast rendering
    // - at this stage, no info is put in searchfield,

    console.log('init')
    this.curieService.setupCurie();
    //const initialSize = this.pageSizes[0];
    this.goApiService.getModelList().then((goCams: GOCam[]) => {
      goCams.map(res => {
        this.models.push(res);
      })

      //const gocams = this.extractModels(goCams);
      //gocams.length = initialSize;
      this.fillWithGOs();
    });
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
    this.goApiService.getAllModelsGOs().then(json => {
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
    this.goApiService.getAllModelsGPs().then(json => {
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

    this.goApiService.getAllModelsPMIDs().then(json => {
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
      this.updateTable(gocams != null);
    });
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
   * Update the Data Table
   * @param isBufferLoading is true, the UI should display that some buffers are still loading
   */
  updateTable(isBufferLoading: boolean) {
    this.dataSource = new GOTableDataSource<GOCamTableModel>(this.models);
    this.dataSource.columns = constants.tableColumns;
    this.dataSource.getPage(1, 50)
    this.setFilterPredicates();

    this.isLoading = false;
    this.isBufferLoading = isBufferLoading;
    this.applyFilter(this.searchFilter);
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

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.dataSource.filter = undefined;
      return;
    }

    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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

  getSpeciesIcon(species: string) {
    //    console.log(species);

    switch (species) {
      case "Drer":
        return "";
      case "Cele":
        return "";
    }
    return "";
  }


  changeSelection(event) {
    console.log("change: ", event.value);
    //this.displayedColumns = event.value;
  }



  findSimilar(queryModel, max: number = 10) {
    console.log("ask to search for models similar to ", queryModel);

    let results = [];
    let scoreA, scoreB, score;
    this.models.forEach(model => {
      scoreA = utils.scoreModel(queryModel, model);
      scoreB = utils.scoreModel(model, queryModel);
      score = (scoreA + scoreB) / 2.0;
      // score = this.scoreModel(model, queryModel);

      if (score >= 0.5) {
        if (results.length < max) {
          results.push({ "score": score, "gocam": model.gocam });
        } else {
          for (let i = 0; i < results.length; i++) {
            if (results[i].score < score) {
              results[i] = { "score": score, "gocam": model.gocam };
              break;
            }
          }
        }
      }
    });

    console.log("RESULTS:");
    let list = "";
    results.forEach(elt => {
      console.log(elt);
      list += elt.gocam.substring(elt.gocam.lastIndexOf("/") + 1) + " OR ";
    })

    if (list.length > 0) {
      list = list.substring(0, list.length - 3).trim();
    }
    this.searchFilter = list;

    this.applyFilter(list);

    window.scrollTo(0, 0);

    return results;
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
      rows.map(row => {
        return [
          <tr>
            {this.renderTitleCell(row)}
            {this.renderTermCell(row, constants.TermCategory.BP)}
            {this.renderTermCell(row, constants.TermCategory.MF)}
            {this.renderTermCell(row, constants.TermCategory.CC)}
            {this.renderTermCell(row, constants.TermCategory.GP)}
            {this.renderGroupCell(row)}
            {this.renderContributorCell(row)}
            {this.renderDateCell(row)}
          </tr>]
      })
    )
  }

  renderTitleCell(row) {
    return (
      <td class="cell-block goc-column-title">
        <div class="row__title">
          <div class="row__title__content">
            <a href="{{ urlHandler.getGraphView(row.gocam) }}" target="blank" class="row__title__link">{row.title} &nbsp;
              <coloredLine color="red" />
            </a>
            <div class="row__articles__container">
              <div class="row__articles__container__citation">Citations:</div>
              <span class="row__article"> {
                row.pmid?.map(pmid => {
                  return [
                    <a href="{{ urlHandler.getPubMedAbstract(pmid) }}" target="_blank">
                      b
                    </a>
                  ]
                })
              }
              </span>
            </div>
            <a href="{{ urlHandler.getGraphView(row.gocam) }}" target="blank"  >
              <span class="row__view-edit">
                Edit
              </span>
            </a>
          </div>
          <div class="row__title__actions">
            <a href="{{ urlHandler.getGraphView(row.gocam) }}" target="blank">
              <button goc-button class="button-open">
                <span>View</span>
              </button>
            </a>
          </div >
        </div >
      </td >
    )
  }

  renderDateCell(row) {
    return (
      <td class="cell-block">
        <span class="">{row.date}</span>
      </td>
    )
  }

  renderTermCell(row, termType) {
    if (!row[termType]) {
      return <td class="cell-block"></td>
    }

    const cellClass = `table-button color-${termType}`

    return (
      <td class="cell-block">
        <div class="u-width-full">
          <span>{
            row[termType].map(term => {
              return [
                <a target="_blank" class={cellClass}>
                  {termType === constants.TermCategory.GP ?
                    term.fullName : term.name}
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
      <td class="goc-column-align-right goc-column-group">
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
      <td class="goc-column-align-right goc-column-group">
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

}





