import React from "react";
import ReactDOM from "react-dom";
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
    textNewLayout,
    textLayoutSaving,
    textLabelModal,
    textButtonSave,
    textButtonClose,
    textLayouts,
    textButtonAdd,
    textButtonReset,
    textSearch,
    namePTable,
    genderPTable,
    dateBirthPTable,
    bloodPTable,
    heightTable,
    visitDateTable,
    infoTable,
    measTable,
    valueTable,
    noteTitle,
    nullNote,
    noPatientSel,
    ageLab,
    sexLab,
    bloodLab,
    tablePatientsText,
    tableVisitText,
    visitInfoText,
    vitalSignsText,
    graphTitleText
} from './allStrings'
const ResponsiveGridLayout = WidthProvider(Responsive);

//class that crates a dashboard
var layoutsInit = {
    lg:[
        {i: "searchPatient", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "allPatients", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 5},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 6},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 3, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxH: 3},
        {i: "VitalSignsGraph", x: 5, y: 1, w: 5, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 4, minH: 7}
    ],
    md: [
        {i: "searchPatient", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "allPatients", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 5},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 6},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 3, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3, maxH: 3},
        {i: "VitalSignsGraph", x: 5, y: 1, w: 5, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 4, minH: 7}
    ],
    sm: [
        {i: "searchPatient", x: 0, y: 0, w: 3, h: 1, minW: 3, maxH: 1},
        {i: "allPatients", x: 0, y: 1, w: 3, h: 6, minW: 3, minH: 5},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 3, h: 6, minW: 3, minH: 6},
        {i: "tableDataVisit", x: 0, y: 3, w: 2, h: 4, minW: 2, minH: 3},
        {i: "noteVisit", x: 2, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 3, y: 0, w: 2, h: 3, minW: 2, minH: 3, maxH: 3},
        {i: "VitalSignsGraph", x: 4, y: 1, w: 3, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 4, y: 2, w: 3, h: 10, minW: 3, minH: 7}
    ],
    xs: [
        {i: "searchPatient", x: 0, y: 0, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "allPatients", x: 0, y: 1, w: 2, h: 6, minW: 2, minH: 5},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 2, h: 6, minW: 2, minH: 6},
        {i: "tableDataVisit", x: 0, y: 3, w: 2, h: 5, minW: 2, minH: 5},
        {i: "noteVisit", x: 1, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 3, maxH: 3},
        {i: "VitalSignsGraph", x: 3, y: 1, w: 2, h: 6, minW: 2, minH: 6},
        {i: "graph", x: 3, y: 2, w: 2, h: 10, minW: 2, minH: 7}
    ],
    xxs: [
        {i: "searchPatient", x: 0, y: 3, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "allPatients", x: 0, y: 4, w: 2, h: 6, minW: 2, minH: 5},
        {i: "tabelVisitPatient", x: 0, y: 5, w: 2, h: 6, minW: 2, minH: 6},
        {i: "tableDataVisit", x: 0, y: 6, w: 2, h: 5, minW: 2, minH: 5},
        {i: "noteVisit", x: 0, y: 7, w: 2, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2, maxH: 3},
        {i: "VitalSignsGraph", x: 0, y: 1, w: 2, h: 11, minW: 2, minH: 8},
        {i: "graph", x: 0, y: 2, w: 2, h: 11, minW: 2, minH: 7}
    ]
};
var layoutCollapse = {
    collapse: {w: 2, h: 1, minW: 2, minH:1, maxH:1}
};

var originalLayouts = getFromDB("layouts", '1');
if (originalLayouts == null) {
    originalLayouts = layoutsInit;
}
var layoutsHMod = JSON.parse(JSON.stringify(originalLayouts));
const allLayouts = getAllLayouts();
export class MyFirstGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            layouts: JSON.parse(JSON.stringify(originalLayouts))
        };
    }

    static get defaultProps() {
        return {
            breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
            className: "layouts",
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            rowHeight: 30
        };
    }

    resetLayout() {
        this.setState({ layouts: layoutsInit });
        this.checkHeightItem();
    }

    onLayoutChange(layout, layouts) {
        saveToDB("layouts", layouts, '1', 'localStorage');
        this.setState({ layouts });
        layoutsHMod = JSON.parse(JSON.stringify(layouts));
        this.checkHeightItem();
    }


    saveLayout() {

        var name = $('#newName').val();
        var idButton = getIdfromDB();
        saveToDB("layouts", this.state.layouts, idButton, name);
        createDiv_SaveLayout(this.setState.bind(this),name, idButton);
        $('#newName').val(textNewLayout);

    }
    checkHeightItem() {
        var layouts = this.state.layouts;
        for (var i = 0; i < layouts.lg.length; i++){
            var id = layouts.lg[i].i;
            if (layouts.lg[i].h <= 1 && layouts.lg[i].i != 'searchPatient')  {
                $('#'+id).css("display", "none");
                $('#coll'+id).attr("disabled", true).css("display", "none");
                $('#show'+id).attr("disabled", false).css("display", "block");
            } else {
                $('#'+id).css("display", "block");
                $('#coll'+id).attr("disabled", false).css("display", "block");
                $('#show'+id).attr("disabled", true).css("display", "none");
            }
        }
    }
    componentDidMount() {
        var obj = JSON.parse(allLayouts)
        $('#layouts-list').attr("aria-expanded","false");
        $('#layouts-list').addClass("collapsed");
        for (var i = 1; i < Object.keys(obj).length; i++){
            createDiv_SaveLayout(this.setState.bind(this), obj[i].layoutName, obj[i].layoutId, this.checkHeightItem.bind(this));
        }
        this.checkHeightItem();

    }

    collapseItem(id, idCButton, idSButton) {
        console.log(layoutsHMod);
        for (var i = 0; i < layoutsHMod.lg.length; i++) {
            if (layoutsHMod.lg[i].i == id) {
                layoutsHMod.lg[i].minH = layoutCollapse.collapse.minH;
                layoutsHMod.lg[i].h = layoutCollapse.collapse.h;
                layoutsHMod.lg[i].maxH = layoutCollapse.collapse.maxH;
                layoutsHMod.md[i].minH = layoutCollapse.collapse.minH;
                layoutsHMod.md[i].h = layoutCollapse.collapse.h;
                layoutsHMod.md[i].maxH = layoutCollapse.collapse.maxH;
                layoutsHMod.sm[i].minH = layoutCollapse.collapse.minH;
                layoutsHMod.sm[i].h = layoutCollapse.collapse.h;
                layoutsHMod.sm[i].maxH = layoutCollapse.collapse.maxH;
                layoutsHMod.xs[i].minH = layoutCollapse.collapse.minH;
                layoutsHMod.xs[i].h = layoutCollapse.collapse.h;
                layoutsHMod.xs[i].maxH = layoutCollapse.collapse.maxH;
                layoutsHMod.xxs[i].minH = layoutCollapse.collapse.minH;
                layoutsHMod.xxs[i].h = layoutCollapse.collapse.h;
                layoutsHMod.xxs[i].maxH = layoutCollapse.collapse.maxH;
                break;
            }
        }
        $('#'+id).css("display", "none");
        this.setState({
            layouts: layoutsHMod
        });
        $('#'+idCButton).attr("disabled", true);
        $('#'+idSButton).attr("disabled", false);
        $('#'+idCButton).css("display", "none");
        $('#'+idSButton).css("display", "block");
        console.log(this.state.layouts);
    };

    expandItem(id, idCButton, idSButton) {

        console.log(layoutsHMod);
        for (var i = 0; i < layoutsHMod.lg.length; i++) {
            if (layoutsHMod.lg[i].i == id) {
                for (var j = 0; j < layoutsInit.lg.length; j++) {
                    if (layoutsInit.lg[j].i == id) {
                        layoutsHMod.lg[i].minH = layoutsInit.lg[j].minH;
                        layoutsHMod.lg[i].h = layoutsInit.lg[j].h;
                        layoutsHMod.lg[i].maxH = undefined;
                        layoutsHMod.md[i].minH = layoutsInit.md[j].minH;
                        layoutsHMod.md[i].h = layoutsInit.md[j].h;
                        layoutsHMod.md[i].maxH = undefined;
                        layoutsHMod.sm[i].minH = layoutsInit.sm[j].minH;
                        layoutsHMod.sm[i].h = layoutsInit.sm[j].h;
                        layoutsHMod.sm[i].maxH = undefined;
                        layoutsHMod.xs[i].minH = layoutsInit.xs[j].minH;
                        layoutsHMod.xs[i].h = layoutsInit.xs[j].h;
                        layoutsHMod.xs[i].maxH = undefined;
                        layoutsHMod.xxs[i].minH = layoutsInit.xxs[j].minH;
                        layoutsHMod.xxs[i].h = layoutsInit.xxs[j].h;
                        layoutsHMod.xxs[i].maxH = undefined;
                    }
                }
            }
        }

        $('#'+id).css("display", "block");
        this.setState({
            layouts: layoutsHMod
        });
        $('#'+idCButton).attr("disabled", false);
        $('#'+idSButton).attr("disabled", true);
        $('#'+idCButton).css("display", "block");
        $('#'+idSButton).css("display", "none");
        console.log(this.state.layouts);
    };

    render() {
        return (
            <div className="d-flex" id="wrapper">
                {/*Modal*/}
                <div className={"modal fade"} id={"modalLayout"} role={"dialog"}>
                    <div className={"modal-dialog"}>

                        <div className={"modal-content"}>
                            <div className={"modal-header"}>
                                <button type={"button"} className={"close"} data-dismiss={"modal"}>&times;</button>
                                <h4 className={"modal-title"}> {textLayoutSaving} </h4>
                            </div>
                            <div className={"modal-body"}>
                                <label>{textLabelModal} </label>
                                <input id={"newName"} type={"text"} defaultValue={textNewLayout}></input>
                            </div>
                            <div className={"modal-footer"}>
                                <button type={"button"} className={"btn btn-default"} data-dismiss={"modal"}> {textButtonClose} </button>
                                <button type={"button"} className={"btn btn-default"} id={"name-saved"}
                                        data-dismiss={"modal"} onClick={() => this.saveLayout()}> {textButtonSave}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>


                    <div className="border-end bg-white" id="sidebar-wrapper">
                        <div className="sidebar-heading border-bottom bg-light">Medical Data Viz</div>
                        <div className="list-group list-group-flush">
                            <a id="layouts-list" href={".submenu1"} data-toggle={"collapse"} aria-expanded={"false"}
                               className={"list-group-item list-group-item-action flex-column align-items-start collapsed"}>
                                <div className={"d-flex w-100 justify-content-start align-items-center"}>
                                    <span className={"fa fa-dashboard fa-fw mr-3"}></span>
                                    <span className={"menu-collapsed"}> { textLayouts } </span>
                                    <span className={"submenu-icon ml-auto"} id={"submenu-icon-up"}> <i className="fas fa-angle-up"></i> </span>
                                    <span className={"submenu-icon ml-auto"} id={"submenu-icon-down"}> <i className="fas fa-angle-down"></i> </span>
                                </div>
                            </a>
                            <div id={"layout-div"}>
                                <div id={'submenu1'} className={"submenu1 sidebar-submenu collapse show"}>
                                    <a href={"#javascript"} className={"layouts-div list-group-item list-group-item-action text-black"}>
                                        <div>
                                            <button className={"btn btn-primary"} id={"add-layout"} data-toggle={"modal"} data-target={"#modalLayout"} value={"1"}>
                                                {textButtonAdd}
                                            </button>
                                            <button className={"btn btn-primary"} onClick={() => this.resetLayout()}>
                                                {textButtonReset}
                                            </button>
                                        </div>
                                    </a>
                                </div>

                            </div>


                        </div>
                    </div>
                    <div id="page-content-wrapper">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                            <div className="container-fluid">
                                <button  id="sidebarToggle" className="navbar-toggler"><span
                                    className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </nav>



                <ResponsiveGridLayout
                    className="layout"
                    breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                    rowHeight={30}
                    layouts={this.state.layouts}
                    onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
                >

                    <div key="searchPatient" className={"searchDiv"} >
                        <span><i className={"fa fa-search"}></i></span>
                        <input type="text" className={"search_patient"} id={"searchPatient"} placeholder={textSearch}
                        />
                    </div>

                            <div key="allPatients" className={"table_patient"} >
                                <div className={"firstDiv"}>
                                    <button id={"collallPatients"} className={"btn-collShow"} onClick={() => this.collapseItem('allPatients', 'collallPatients', 'showallPatients')}> <i className="fas fa-angle-up"></i></button>
                                    <button id={"showallPatients"} className={"btn-collShow"} onClick={() => this.expandItem('allPatients', 'collallPatients', 'showallPatients')}>
                                        <i className="fas fa-angle-down"></i></button>
                                    <h5 className={"h4_titleDiv"}>{tablePatientsText}</h5>
                                </div>
                                <div className={"table-responsive"} id={"allPatients"}>
                                    <table id={"tableAllPatient"} className={"table table-hover nowrap"}
                                           style={{width:100 + '%'}}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>{namePTable}</th>
                                            <th>{genderPTable}</th>
                                            <th>{dateBirthPTable}</th>
                                            <th>{bloodPTable}</th>
                                            <th>{heightTable}</th>
                                        </tr>
                                        </thead>
                                        <tbody id={"patientTableBody"}>
                                        </tbody>
                                    </table>

                                </div>
                            </div>


                    <div key="tabelVisitPatient" className={"table_visit_patient"} >
                        <div className={"firstDiv"}>
                            <button id={"colltabelVisitPatient"} className={"btn-collShow"} onClick={() => this.collapseItem('tabelVisitPatient', 'colltabelVisitPatient', 'showtabelVisitPatient')}> <i className="fas fa-angle-up"></i></button>
                            <button id={"showtabelVisitPatient"} className={"btn-collShow"} onClick={() => this.expandItem('tabelVisitPatient', 'colltabelVisitPatient', 'showtabelVisitPatient')}>
                                <i className="fas fa-angle-down"></i></button>
                            <h5 className={"h4_titleDiv"}>{tableVisitText}</h5>
                        </div>
                        <div className={"table-responsive"} id={"tabelVisitPatient"} >
                            <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{visitDateTable}</th>
                                    <th>{infoTable}</th>
                                </tr>
                                </thead>
                                <tbody id={"tableVisitDate"}>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div key="tableDataVisit" className={"table_data_visit"}>
                        <div className={"firstDiv"}>
                            <button id={"colltableDataVisit"} className={"btn-collShow"} onClick={() => this.collapseItem('tableDataVisit', 'colltableDataVisit', 'showtableDataVisit')}> <i className="fas fa-angle-up"></i></button>
                            <button id={"showtableDataVisit"} className={"btn-collShow"} onClick={() => this.expandItem('tableDataVisit', 'colltableDataVisit', 'showtableDataVisit')}>
                                <i className="fas fa-angle-down"></i></button>
                            <h5 className={"h4_titleDiv"}>{visitInfoText}</h5>
                        </div>
                        <div className={"table-responsive"} id={"tableDataVisit"} >
                            <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                <thead>
                                <tr>
                                    <th>{measTable}</th>
                                    <th>{valueTable}</th>
                                </tr>
                                </thead>
                                <tbody id={"measurementTable"}>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div key="noteVisit" className={"div_note_visit"} >
                        <div id={"titleNote"} className={"firstDiv"}>
                            <button id={"collnoteVisit"} className={"btn-collShow"} onClick={() => this.collapseItem('noteVisit', 'collnoteVisit', 'shownoteVisit')}> <i className="fas fa-angle-up"></i></button>
                            <button id={"shownoteVisit"} className={"btn-collShow"} onClick={() => this.expandItem('noteVisit', 'collnoteVisit', 'shownoteVisit')}>
                                <i className="fas fa-angle-down"></i></button>
                            <h5 className={"h4_titleDiv"}>{noteTitle}</h5>
                        </div>
                        <div id={"noteVisit"} style={{width: 100+'%', height: 90+'%'}}>
                            <p id={"noteVisit"}>{nullNote}</p>
                        </div>
                    </div>

                    <div key="patientInfo" className={"personal_info"} >
                        <div style={{width: 100+'%', height: 100+'%'}} id={"patientInfo"}>
                        <div>
                            <h3 id={"patientName"}> {noPatientSel} </h3>
                        </div>
                        <div className={"informationTable"}>
                            <div className={"p-2 d-flex stats"}>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>{ageLab}</span><span
                                    id={"ageSpan"}>-</span></div>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>{sexLab}</span><span
                                    id={"sexSpan"}>-</span></div>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>{bloodLab}</span><span
                                    id={"bloodSpan"}>-</span></div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div key="VitalSignsGraph" className={"div_filter"} >
                        <div className={"firstDiv"}>
                            <button id={"collVitalSignsGraph"} className={"btn-collShow"} onClick={() => this.collapseItem('VitalSignsGraph', 'collVitalSignsGraph', 'showVitalSignsGraph')}> <i className="fas fa-angle-up"></i></button>
                            <button id={"showVitalSignsGraph"} className={"btn-collShow"} onClick={() => this.expandItem('VitalSignsGraph', 'collVitalSignsGraph', 'showVitalSignsGraph')}>
                                <i className="fas fa-angle-down"></i></button>
                            <h5 className={"h4_titleDiv"}>{vitalSignsText}</h5>
                        </div>
                        <div id={"VitalSignsGraph"} style={{width: 100+'%', height: 90+'%'}}>
                            <div style={{width: 100+'%', height: 25+'%'}}>
                                <svg id={"svg-hr"} viewBox={"0 0 600 100"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div style={{width: 100+'%', height: 25+'%'}}>
                                <svg id={"svg-rr"} viewBox={"0 0 600 100"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div style={{width: 100+'%', height: 25+'%'}}>
                                <svg id={"svg-sp"} viewBox={"0 0 600 100"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div style={{width: 100+'%', height: 25+'%'}}>
                                <svg id={"svg-dp"} viewBox={"0 0 600 100"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div key="graph" className={"div_graph"} id={"containerSvg"} >
                        <div className={"firstDiv"}>
                            <button id={"collgraph"} className={"btn-collShow"} onClick={() => this.collapseItem('graph', 'collgraph', 'showgraph')}>
                                <i className="fas fa-angle-up"></i></button>
                            <button id={"showgraph"} className={"btn-collShow"} onClick={() => this.expandItem('graph', 'collgraph', 'showgraph')}>
                                <i className="fas fa-angle-down"></i></button>
                            <h5 className={"h4_titleDiv"}>{graphTitleText}</h5>
                        </div>
                        <div id={"graph"} style={{width: 100+'%', height: 90+'%'}}>
                        <div id={"titleGraph"}><select id={"selectValue"} multiple={'multiple'} name={'measurement[]'}>
                        </select>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="switchChart"></input>
                            </div>
                        </div>
                            <svg id={"svg-main"} viewBox={"0 0 600 400"} preserveAspectRatio={"none"}>
                            </svg>

                            <div id={"container-1"} style={{width: 100+'%', height: 20+'%', display: "none"}}>
                                <svg id={"svg-main-1"} viewBox={"0 0 600 80"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div id={"container-2"}  style={{width: 100+'%', height: 20+'%', display: "none"}}>
                                <svg id={"svg-main-2"} viewBox={"0 0 600 80"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div id={"container-3"}  style={{width: 100+'%', height: 20+'%', display: "none"}}>
                                <svg id={"svg-main-3"} viewBox={"0 0 600 80"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>
                            <div id={"container-4"}  style={{width: 100+'%', height: 20+'%', display: "none"}}>
                                <svg id={"svg-main-4"} viewBox={"0 0 600 80"} preserveAspectRatio={"none"}>
                                </svg>
                            </div>


                        </div>
                    </div>
                </ResponsiveGridLayout>
                </div>
          </div>
        )
    }
}

function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
        } catch (e) {
        }
    }
    return ls[key];
}

function saveToLS(key, value) {

    if (global.localStorage) {
        var string = JSON.stringify({[key]: value});
        global.localStorage.setItem(
            "rgl-8",
            JSON.stringify({
                [key]: value
            })
        );
    }
}

function saveToDB (key, value, id, name) {
    var string = JSON.stringify({[key]: value});

     $.ajax({
        type: 'POST',
        url: 'LayoutConfig',
        dataType: 'text',
        data: {"layoutId" : id, "layoutName": name, "layouts": string},
        success: function (response) {
        }
    });
}

function getFromDB(key, id) {
    var result = "";
    $.ajax({
        type: 'POST',
        async: false,
        url: 'LayoutConfig',
        dataType: 'text',
        data: {"layoutId" : id},
        success: function (response) {
            if (response != 'failed') {
                let ls = {};
                ls = JSON.parse(response) || {};
                result = ls[key];
            }
            else result = null;
        }
    });
    return result;
}

function getIdfromDB() {
    var result = "";
    $.ajax({
        type: 'POST',
        async: false,
        url: 'LayoutConfig',
        dataType: 'text',
        success: function (response) {
            if (response != 'failed') result = response;
        }
    });
    return result;
}

function deleteLayout(id) {
    $.ajax({
        type: 'POST',
        async: false,
        url: 'LayoutConfig',
        dataType: 'text',
        data: {"layoutId" : id, "boolDelete": "true"},
        success: function (response) {
            document.getElementById("submenu"+id).remove();
        }
    });
}

function getAllLayouts() {
    var result = "";
    $.ajax({
        type: 'POST',
        async: false,
        url: 'LayoutConfig',
        dataType: 'text',
        data: {"boolAllLayout": "true"},
        success: function (response) {
            result = response;
        }
    });
    return result;
}

function createDiv_SaveLayout(setState, name, idButton, checkHeightItem) {
    // item creation
    //main <div>
    var newLayout = document.createElement("div");
    newLayout.classList.add('collapse','sidebar-submenu', 'show','submenu1');
    newLayout.id = "submenu"+idButton;
    //second <a>
    var newA = document.createElement("a");
    newA.href = "#javascript";
    newA.classList.add('layouts-div', 'list-group-item', 'list-group-item-action', 'text-black');
    //<div> child <a>
    var divChildA = document.createElement("div");
    //<span> child <div>
    var spanDiv = document.createElement("span");
    spanDiv.innerHTML = name;
    spanDiv.classList.add('menu-collapsed');

    divChildA.appendChild(spanDiv);

    newA.appendChild(divChildA);

    //<div> with buttons
    var divButton = document.createElement("div");
    //delete button
    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "<i class='fas fa-minus'></i>";
    buttonDelete.value=idButton;
    buttonDelete.classList.add('btn-primary', 'btn');
    buttonDelete.id = "btnDelete"
    buttonDelete.addEventListener('click', function () {
        deleteLayout(this.value);
    });
    //apply button
    var buttonApply = document.createElement("button");
    buttonApply.innerHTML = "<i class='fas fa-arrow-right'></i>";
    buttonApply.value=idButton;
    buttonApply.classList.add('btn-primary', 'btn');
    buttonApply.id = "layoutBtn"+idButton;
    //set state on click button
    buttonApply.addEventListener('click', function() {
        var layout = getFromDB("layouts",this.value); //get layout
        setState({ layouts: JSON.parse(JSON.stringify(layout)) }); //set layout
        checkHeightItem;
    });
    //add buttons to div
    divButton.appendChild(buttonDelete);
    divButton.appendChild(buttonApply);

    newA.appendChild(divButton);

    newLayout.appendChild(newA);
    //append new layout to list
    var mainUl = document.getElementById("layout-div");
    mainUl.appendChild(newLayout);
}



