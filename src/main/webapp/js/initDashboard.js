// this class implements functions to create a dashboard
import React from "react";
import ReactDOM from "react-dom";
import { Responsive, WidthProvider } from 'react-grid-layout';
//import of strings from allString.js file
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
    startDateTable,
    endDateTable,
    typeInfoTable,
    infoTable,
    measTable,
    valueTable,
    noteTitle,
    noPatientSel,
    ageLab,
    sexLab,
    bloodLab,
    tablePatientsText,
    tableVisitText,
    visitInfoText,
    vitalSignsText,
    graphTitleText,
    timelineTitleText,
    dateFilterTitle,
    heatmapTitleText,
    btnHeatmapApply,
    labelSwitchMulti,
    labelSwitchSingle,
    filterPHRAllTypes,
    filterPHRSurgery,
    filterPHRMedicine,
    filterPHRClnAnl,
    filterPHRDisease,
    filterPHRDiaRadiology,
    tabDetails,
    tabDiseases,
    tabMedicines,
    modalHRFormTitle,
    descriptionHR,
    filterOST,
    filterOSTSex,
    filterOSTRace,
    filterOSTAge,
    filterOSTBMI
} from './allStrings'
//responsive width for GridLayout - React
const ResponsiveGridLayout = WidthProvider(Responsive);

//set default properties of each item in the dashboard
//properties: (i: id,x: x-position,y: y-position,w: width,h: height, minW (maxW): minimum (maximum) width, minH (maxH): minimum (maximum) height)
var layoutsInit = {
    lg:[
        {i: "allPatients", x: 0, y: 0, w: 6, h: 8, minW: 3, minH: 6},
        {i: "tableAnalysis", x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 6},
        {i: "allDataInformation", x: 0, y: 17, w: 6, h: 8, minW: 3, minH: 3},
        {i: "patientInfo", x: 6, y: 0, w: 3, h: 4, minW: 3, minH: 4, maxH: 4},
        {i: "VitalSignsGraph", x: 6, y: 5, w: 6, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 7, y: 16, w: 6, h: 11, minW: 4, minH: 7},
        {i: "dateFilter", x: 11, y: 0, w: 3, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "heatmap", x: 0, y: 37, w: 6, h: 11, minW: 4, minH: 7},
        {i: "scatterPlot", x: 7, y: 37, w: 6, h: 11, minW: 4, minH: 7},
        {i: "timelineChart", x: 0, y: 28, w: 12, h: 8, minW: 4, minH: 8}
    ],
    md: [
        {i: "allPatients", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 5},
        {i: "tableAnalysis", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 6},
        {i: "allDataInformation", x: 0, y: 3, w: 5, h: 5, minW: 3, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 4, minW: 3, minH: 4, maxH: 4},
        {i: "VitalSignsGraph", x: 5, y: 2, w: 5, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 5, y: 3, w: 5, h: 11, minW: 4, minH: 7},
        {i: "dateFilter", x: 11, y: 0, w: 2, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "heatmap", x: 0, y: 6, w: 5, h: 11, minW: 4, minH: 7},
        {i: "scatterPlot", x: 5, y: 6, w: 5, h: 11, minW: 4, minH: 7},
        {i: "timelineChart", x: 0, y: 5, w: 5, h: 10, minW: 4, minH: 8}
    ],
    sm: [
        {i: "allPatients", x: 0, y: 1, w: 3, h: 6, minW: 3, minH: 5},
        {i: "tableAnalysis", x: 0, y: 2, w: 3, h: 6, minW: 3, minH: 6},
        {i: "allDataInformation", x: 0, y: 3, w: 3, h: 4, minW: 2, minH: 3},
        {i: "patientInfo", x: 3, y: 0, w: 2, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "VitalSignsGraph", x: 4, y: 2, w: 3, h: 10, minW: 4, minH: 8},
        {i: "graph", x: 4, y: 3, w: 3, h: 10, minW: 3, minH: 7},
        {i: "dateFilter", x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "heatmap", x: 0, y: 6, w: 5, h: 10, minW: 4, minH: 7},
        {i: "scatterPlot", x: 0, y: 6, w: 5, h: 10, minW: 4, minH: 7},
        {i: "timelineChart", x: 0, y: 5, w: 3, h: 10, minW: 4, minH: 8}
    ],
    xs: [
        {i: "allPatients", x: 0, y: 1, w: 2, h: 6, minW: 2, minH: 5},
        {i: "tableAnalysis", x: 0, y: 2, w: 2, h: 6, minW: 2, minH: 6},
        {i: "allDataInformation", x: 0, y: 3, w: 2, h: 5, minW: 2, minH: 5},
        {i: "patientInfo", x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "VitalSignsGraph", x: 3, y: 2, w: 2, h: 7, minW: 2, minH: 7},
        {i: "graph", x: 3, y: 3, w: 2, h: 10, minW: 2, minH: 7},
        {i: "dateFilter", x: 5, y: 0, w: 2, h: 4, minW: 1, minH: 4, maxH: 4},
        {i: "heatmap", x: 0, y: 6, w: 5, h: 10, minW: 4, minH: 7},
        {i: "scatterPlot", x: 0, y: 6, w: 5, h: 10, minW: 4, minH: 7},
        {i: "timelineChart", x: 0, y: 5, w: 2, h: 6, minW: 2, minH: 6},
    ],
    xxs: [
        {i: "allPatients", x: 0, y: 4, w: 2, h: 6, minW: 2, minH: 5},
        {i: "tableAnalysis", x: 0, y: 5, w: 2, h: 6, minW: 2, minH: 6},
        {i: "allDataInformation", x: 0, y: 6, w: 2, h: 5, minW: 2, minH: 5},
        {i: "patientInfo", x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 4, maxH: 4},
        {i: "VitalSignsGraph", x: 0, y: 1, w: 2, h: 11, minW: 2, minH: 8},
        {i: "graph", x: 0, y: 2, w: 2, h: 11, minW: 2, minH: 7},
        {i: "dateFilter", x: 0, y: 7, w: 2, h: 4, minW: 1, minH: 4, maxH: 4},
        {i: "heatmap", x: 0, y: 8, w: 6, h: 11, minW: 4, minH: 7},
        {i: "scatterPlot", x: 0, y: 9, w: 6, h: 11, minW: 4, minH: 7},
        {i: "timelineChart", x: 0, y: 3, w: 2, h: 11, minW: 2, minH: 8}
    ]
};
//layout that sets the properties of a collapsing element
var layoutCollapse = {
    collapse: {w: 2, h: 1, minW: 2, minH:1, maxH:1}
};
//layout of each item saved in the database
var originalLayouts;
//all layouts to be displayed in the left bar
const allLayouts = getAllLayouts();
var obj = JSON.parse(allLayouts);
var layoutLSId;
for (var i = 0; i < Object.keys(obj).length; i++){
    if (obj[i].layoutName == 'localStorage') {
        originalLayouts = getFromDB("layouts", obj[i].layoutId);
        layoutLSId = obj[i].layoutId;
        break;
    }
}
//if there are no layouts in the database, use the default layout and create new localStorage
if (originalLayouts == null) {
    originalLayouts = layoutsInit;
    var idButton = getIdfromDB();
    saveToDB("layouts", originalLayouts, idButton, 'localStorage');
}
//layout used to collapse-expand element
var layoutsHMod = JSON.parse(JSON.stringify(originalLayouts));
//react class that creates the Dashboard
export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { //set layout of dashboard
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
    //reset default layout
    resetLayout() {
        this.setState({ layouts: layoutsInit });
        this.checkHeightItem();
    }
    //called when layout changes
    onLayoutChange(layout, layouts) {
        //save in the database new layout
        saveToDB("layouts", layouts, layoutLSId, 'localStorage');
        //change state
        this.setState({ layouts });
        layoutsHMod = JSON.parse(JSON.stringify(layouts));
        this.checkHeightItem();
    }

    //saves new layout when SAVE button is clicked
    saveLayout() {
        var name = $('#newName').val();
        var idButton = getIdfromDB();
        saveToDB("layouts", this.state.layouts, idButton, name);
        createDiv_SaveLayout(this.setState.bind(this),name, idButton);
        $('#newName').val(textNewLayout);
    }
    //check the height of the element and set the icon to display
    checkHeightItem() {
        var layouts = this.state.layouts;
        for (var i = 0; i < layouts.lg.length; i++){
            var id = layouts.lg[i].i;
            if (layouts.lg[i].h <= 1 && layouts.lg[i].i != 'searchPatient')  {
                //div not displayed (item is collapsed)
                $('#'+id).css("display", "none");
                $('#coll'+id).attr("disabled", true).css("display", "none");
                $('#show'+id).attr("disabled", false).css("display", "");
            } else {
                //div is displayed (item is no collapsed)
                $('#'+id).css("display", "");
                $('#coll'+id).attr("disabled", false).css("display", "");
                $('#show'+id).attr("disabled", true).css("display", "none");
            }
        }
    }
    //called after the render method of the class
    componentDidMount() {
        var obj = JSON.parse(allLayouts);
        $('#layouts-list').attr("aria-expanded","false");
        $('#layouts-list').addClass("collapsed");
        for (var i = 0; i < Object.keys(obj).length; i++){
            if (obj[i].layoutName != "localStorage")
                createDiv_SaveLayout(this.setState.bind(this), obj[i].layoutName, obj[i].layoutId, this.checkHeightItem.bind(this));
        }
        this.checkHeightItem();
    }

    //called to collapse an element (id of element, idCButton collapse button id, idSButton show button id)
    collapseItem(id, idCButton, idSButton) {
        for (var i = 0; i < layoutsHMod.lg.length; i++) {
            if (layoutsHMod.lg[i].i == id) {
                //sets the properties of the collapsing element
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
        //set a new layout with collapsed element
        this.setState({
            layouts: layoutsHMod
        });
        $('#'+idCButton).attr("disabled", true);
        $('#'+idSButton).attr("disabled", false);
        $('#'+idCButton).css("display", "none");
        $('#'+idSButton).css("display", "");
    };
    //called to expand an element (id of element, idCButton collapse button id, idSButton show button id)
    expandItem(id, idCButton, idSButton) {
        for (var i = 0; i < layoutsHMod.lg.length; i++) {
            if (layoutsHMod.lg[i].i == id) {
                for (var j = 0; j < layoutsInit.lg.length; j++) {
                    if (layoutsInit.lg[j].i == id) {
                        //sets the properties of the expanded element
                        layoutsHMod.lg[i].minH = layoutsInit.lg[j].minH;
                        layoutsHMod.lg[i].h = layoutsInit.lg[j].h;
                        layoutsHMod.lg[i].maxH = layoutsInit.lg[j].maxH;
                        layoutsHMod.md[i].minH = layoutsInit.md[j].minH;
                        layoutsHMod.md[i].h = layoutsInit.md[j].h;
                        layoutsHMod.md[i].maxH = layoutsInit.md[j].maxH;
                        layoutsHMod.sm[i].minH = layoutsInit.sm[j].minH;
                        layoutsHMod.sm[i].h = layoutsInit.sm[j].h;
                        layoutsHMod.sm[i].maxH = layoutsInit.sm[j].maxH;
                        layoutsHMod.xs[i].minH = layoutsInit.xs[j].minH;
                        layoutsHMod.xs[i].h = layoutsInit.xs[j].h;
                        layoutsHMod.xs[i].maxH = layoutsInit.xs[j].maxH;
                        layoutsHMod.xxs[i].minH = layoutsInit.xxs[j].minH;
                        layoutsHMod.xxs[i].h = layoutsInit.xxs[j].h;
                        layoutsHMod.xxs[i].maxH = layoutsInit.xxs[j].maxH;
                    }
                }
            }
        }
        $('#'+id).css("display", "");
        //set a new layout with expanded element
        this.setState({
            layouts: layoutsHMod
        });
        $('#'+idCButton).attr("disabled", false);
        $('#'+idSButton).attr("disabled", true);
        $('#'+idCButton).css("display", "");
        $('#'+idSButton).css("display", "none");
    };

    //NOTE:
    // to create a new item to insert on the dashboard, declare it inside the ResponsiveGridLayout as follows:
    // <div key='[unique key]' className={"..."} >
    //     title div
    //     <div id={"..."} className={"..."}>
    //         <button id={"coll[div id]"} className={"btn-collShow"} onClick={() => this.collapseItem([div id], [collapse button id], [show button id])}> <i className="fas fa-angle-up"></i></button>
    //         <button id={"show[div id]"} className={"btn-collShow"} onClick={() => this.expandItem([div id], [collapse button id], [show button id])}><i className="fas fa-angle-down"></i></button>
    //         <h5 className={"h4_titleDiv"}> [title] </h5>
    //     </div>
    //     <div id={"[div id]"} style={{...}}>
    //         ...
    //     </div>
    // </div>
    //and then create the properties {i: key, h: ..., ..., } in the layoutsInit array

    //first method called that creates items
    render() {
        return (

            <div className="d-flex" id="wrapper">
                {/*Modal element*/}
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

                {/*modal form -> new health record*/}
                <div className={"modal fade"} id={"modal-HRform"} role={"dialog"}>

                    <div className={"modal-dialog"}>

                        <div className={"modal-content"}>
                            <div className={"modal-header"}>
                                <button type={"button"} className={"close"} data-dismiss={"modal"}>&times;</button>
                                <h4 className={"modal-title"}> {modalHRFormTitle} </h4>
                            </div>
                            <div className={"modal-body"}>
                                    <div className="form-group">
                                        <label>{typeInfoTable}:</label>
                                        <select id={'selectTypeHealthRecord'} className={"form-select form-select-sm"} aria-label={".form-select-sm example"} defaultValue={'null'}>
                                            <option value={"medicine"}>{filterPHRMedicine}</option>
                                            <option value={"disease"}>{filterPHRDisease}</option>
                                            <option value={"surgery"}>{filterPHRSurgery}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label> {namePTable}: </label>
                                        <input type="text" className="form-control"  id={"nameHealthRecord"} required />
                                    </div>
                                    <div className="form-group" className={"date_row"}>
                                        <label>{startDateTable}: </label>
                                        <div className="inputDate">
                                            <input type="datetime-local" name="startDateHR" id="startDateHR"/>
                                        </div>
                                        <label>{endDateTable}: </label>
                                        <div className="inputDate">
                                            <input type="datetime-local" name="endDateHR" id="endDateHR"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label> {descriptionHR}: </label>
                                        <input id={"descriptionRecord"} className="form-control" type={"text"} defaultValue={" "} required/>
                                    </div>

                            </div>
                            <div className={"modal-footer"}>
                                <button type={"button"} className={"btn btn-default"} data-dismiss={"modal"}> {textButtonClose} </button>
                                <button type={"button"} className={"btn btn-default"} id={"saveHealthRecord"}
                                        data-dismiss={"modal"} > {textButtonSave}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>


                {/*left nav bar*/}
                    <div className="border-end bg-white" id="sidebar-wrapper">

                        <div className="sidebar-heading border-bottom bg-light">HealthDatalyze</div>

                        <div className={"sidebar-footing border-bottom bg-light"} id={"doctorInformation"}>
                            <h4>Welcome, </h4>
                            <h5 id={"doctorName"}></h5>
                            <small>ID No</small>
                            <small id={"doctorId"}></small>
                            <form className={"form"} role={"form"} action={"Logout"} method={"post"}>
                                <div className={"form-group"} id={"formBtnLogout"}>
                                    <button type={"submit"} id={"btnLogout"}
                                            className={"btn btn-primary btn-block create-account"}>
                                        <i className="fas fa-sign-out-alt"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="list-group list-group-flush">

                            <a id="layouts-list" href={".submenu1"} data-toggle={"collapse"} aria-expanded={"false"}
                               className={"list-group-item list-group-item-action flex-column align-items-start collapsed"}>
                                <div className={"d-flex w-100 justify-content-start align-items-center"}>
                                    <span className={"fa fa-bookmark fa-fw mr-3"}></span>
                                    <span className={"menu-collapsed"}> { textLayouts } </span>
                                    <span className={"submenu-icon ml-auto"} id={"submenu-icon-up"}> <i
                                        className="fas fa-angle-double-down"></i> </span>
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
                   {/*center div*/}
                    <div id="page-content-wrapper">
                        {/*nav bar*/}
                        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                            <div className="container-fluid">
                                <button  id="sidebarToggle" className="navbar-toggler"><span
                                    className="navbar-toggler-icon"></span>
                                </button>
                            </div>
                        </nav>
                        {/*GridLayout from react-grid-layout*/}
                    <ResponsiveGridLayout
                        className="layout"
                        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                        rowHeight={30}
                        layouts={this.state.layouts}
                        onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}>


                        {/*all patients table*/}
                        <div key="allPatients" className={"table_patient"} >
                            <div className={"firstDiv"}>
                                <button id={"collallPatients"} className={"btn-collShow"} onClick={() => this.collapseItem('allPatients', 'collallPatients', 'showallPatients')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showallPatients"} className={"btn-collShow"} onClick={() => this.expandItem('allPatients', 'collallPatients', 'showallPatients')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{tablePatientsText}</h5>
                            </div>
                            <div id={"allPatientsDiv"} style={{width: 100+'%', height: 85+'%'}}>
                                <div className={"searchDiv"} >
                                    <span><i className={"fa fa-search"}></i></span>
                                    <input type="text" className={"search_patient"} id={"searchPatient"} placeholder={textSearch}/>
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
                        </div>
                        {/*table with all analisys, diseases, surgical operations of a patient*/}
                        <div key="tableAnalysis" className={"table_visit_patient"} >
                            <div className={"firstDiv"}>
                                <button id={"colltableAnalysis"} className={"btn-collShow"} onClick={() => this.collapseItem('tableAnalysis', 'colltableAnalysis', 'showtableAnalysis')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showtableAnalysis"} className={"btn-collShow"} onClick={() => this.expandItem('tableAnalysis', 'colltableAnalysis', 'showtableAnalysis')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{tableVisitText}</h5>
                            </div>
                            <div id={"tableAnalysis"} style={{width: 100+'%', height: 85+'%'}}>
                                <div className={"selectType"} >
                                    <select id={'selectTypeInfo'} className={"form-select form-select-sm"} aria-label={".form-select-sm example"} defaultValue={'all'}>
                                        <option value={'all'}>{filterPHRAllTypes}</option>
                                        <option value={'surgery'}>{filterPHRSurgery}</option>
                                        <option value={'medicine'}>{filterPHRMedicine}</option>
                                        <option value={'clinical analysis'}>{filterPHRClnAnl}</option>
                                        <option value={'disease'}>{filterPHRDisease}</option>
                                        <option value={'diagnostic radiology'}>{filterPHRDiaRadiology}</option>
                                    </select>
                                    <button className={"btn btn-primary"} id={"add-healthRecord"} data-toggle={"modal"} data-target={"#modal-HRform"} value={"1"} disabled>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div className={"table-responsive"} id={"tableResponsiveAnalysis"} >
                                    <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>{startDateTable}</th>
                                            <th>{endDateTable}</th>
                                            <th>{typeInfoTable}</th>
                                            <th>{infoTable}</th>
                                        </tr>
                                        </thead>
                                        <tbody id={"tableVisitDate"}>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                        {/*table with information about health record*/}
                        <div key="allDataInformation" className={"table_data_visit"}>
                            <div className={"firstDiv"}>
                                <button id={"collallDataInformation"} className={"btn-collShow"} onClick={() => this.collapseItem('allDataInformation', 'collallDataInformation', 'showallDataInformation')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showallDataInformation"} className={"btn-collShow"} onClick={() => this.expandItem('allDataInformation', 'collallDataInformation', 'showallDataInformation')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{visitInfoText}</h5>
                            </div>
                            <div className={"table-responsive"} id={"allDataInformation"} >
                                <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                    <tbody id={"measurementTable"}>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/*patient personal information*/}
                        <div key="patientInfo" className={"personal_info"} >
                            <div style={{width: 100+'%', height: 100+'%'}} id={"patientInfo"} className={"tabbable"}>

                                <ul className={"nav nav-tabs"} id={"menuPatientInfo"}>
                                    <li className={"nav-item"}><a className={"nav-link active"} href={"#tabPersonalInfo"} data-toggle={"tab"}>{tabDetails}</a></li>
                                    <li className={"nav-item"}><a className={"nav-link"} href={"#tabDiseases"} data-toggle={"tab"}>{tabDiseases}</a></li>
                                    <li className={"nav-item"}><a className={"nav-link"} href={"#tabMedicines"} data-toggle={"tab"}>{tabMedicines}</a></li>
                                </ul>

                                <div className={"tab-content"}>

                                    <div className={"tab-pane fade show active"} id={"tabPersonalInfo"}>
                                        <div id={"patientInfoIMG"}>
                                            <div id={"patientAvatar"}></div>
                                            <div id={"otherInfo"}>
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
                                    </div>

                                    <div className={"tab-pane fade"} id={"tabDiseases"}>
                                        <ul className={"list-group"} id={"list-diseases"}>
                                        </ul>
                                    </div>

                                    <div className={"tab-pane fade"} id={"tabMedicines"}>
                                        <ul className={"list-group"} id={"list-medicines"}>
                                        </ul>
                                    </div>


                                </div>


                            </div>
                        </div>

                        {/*vital signs graph*/}
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
                        {/*graph for data visualization*/}
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
                                    <div className={"div_switch"}>
                                        <span className={"labelSwitch"}>{labelSwitchMulti}</span>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="switchChart"></input>
                                        </div>
                                        <span className={"labelSwitch"}>{labelSwitchSingle}</span>
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


                        <div key="dateFilter" className={"div_dateFilter"} >
                            <div id={"titleDateFilter"} className={"firstDiv"}>
                                <button id={"colldateFilter"} className={"btn-collShow"} onClick={() => this.collapseItem('dateFilter', 'colldateFilter', 'showdateFilter')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showdateFilter"} className={"btn-collShow"} onClick={() => this.expandItem('dateFilter', 'colldateFilter', 'showdateFilter')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{dateFilterTitle}</h5>
                            </div>
                            <div id={"dateFilter"} className={"date_row"} style={{width: 100+'%', height: 90+'%'}}>
                                <div className="inputDate">
                                    <input type="date" name="startDate" id="startDate" disabled/>
                                </div>
                                <div className="inputDate">
                                    <input type="date" name="endDate" id="endDate" disabled/>
                                </div>
                                <button className={"btn btn-primary"} id="btnFilterDate" disabled>{btnHeatmapApply}</button>
                            </div>
                        </div>


                        {/*heatmap chart based on genes and patients*/}
                        <div key="heatmap" className={"div_heatmap"} id={"containerHeatmap"} >
                            <div className={"firstDiv"}>
                                <button id={"collheatmap"} className={"btn-collShow"} onClick={() => this.collapseItem('heatmap', 'collheatmap', 'showheatmap')}>
                                    <i className="fas fa-angle-up"></i></button>
                                <button id={"showheatmap"} className={"btn-collShow"} onClick={() => this.expandItem('heatmap', 'collheatmap', 'showheatmap')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{heatmapTitleText}</h5>
                            </div>
                            <div id={"heatmap"} style={{width: 100+'%', height: 90+'%'}}>
                                <div id={"titleHeatmap"}>
                                    <select id={"selectValueHeatmap"} multiple={'multiple'} name={'measurement[]'}>
                                    </select>
                                    <select id={"selectPatientHeatmap"} multiple={'multiple'} name={'measurement[]'}>
                                    </select>
                                    <button className={"btn btn-primary"} id={"createHeatmap"} disabled>
                                        {btnHeatmapApply}
                                    </button>
                                </div>
                                <div id={"heatmapChart"} style={{width: 100+'%', height: 85+'%'}}>

                                </div>

                            </div>
                        </div>

                        {/*scatter plot*/}
                        <div key="scatterPlot" className={"div_scatterPlot"} id={"containerScatterplot"}>
                            <div id={"titleNote"} className={"firstDiv"}>
                                <button id={"collscatterPlot"} className={"btn-collShow"} onClick={() => this.collapseItem('scatterPlot', 'collscatterPlot', 'showscatterPlot')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showscatterPlot"} className={"btn-collShow"} onClick={() => this.expandItem('scatterPlot', 'collscatterPlot', 'showscatterPlot')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{noteTitle}</h5>
                            </div>
                            <div id={"scatterPlot"} style={{width: 100+'%', height: 90+'%'}}>
                                <div id={"titleScatterPlot"}>
                                    <select id={'selectCategorySP'} className={"form-select form-select-sm"} aria-label={".form-select-sm example"} defaultValue={'Osteoarthritis'}>
                                        <option value={'Osteoarthritis'}>{filterOST}</option>
                                        <option value={'sex'}>{filterOSTSex}</option>
                                        <option value={'race'}>{filterOSTRace}</option>
                                        <option value={'age_cat'}>{filterOSTAge}</option>
                                        <option value={'bmi_cat'}>{filterOSTBMI}</option>
                                    </select>
                                </div>
                                <div id={"scatterPlotChart"} style={{width: 100+'%', height: 85+'%'}}>

                                </div>
                            </div>
                        </div>

                        {/*timeline chart*/}
                        <div key="timelineChart" className={"div_timelineChart"} >
                            <div className={"firstDiv"}>
                                <button id={"colltimelineChart"} className={"btn-collShow"} onClick={() => this.collapseItem('timelineChart', 'colltimelineChart', 'showtimelineChart')}> <i className="fas fa-angle-up"></i></button>
                                <button id={"showtimelineChart"} className={"btn-collShow"} onClick={() => this.expandItem('timelineChart', 'colltimelineChart', 'showtimelineChart')}>
                                    <i className="fas fa-angle-down"></i></button>
                                <h5 className={"h4_titleDiv"}>{timelineTitleText}</h5>
                            </div>
                            <div id={"timelineChart"} style={{width: 100+'%', height: 100+'%'}}>

                            </div>
                        </div>

                    </ResponsiveGridLayout>

                </div>
          </div>
        )
    }
}

//save layout in the database (key of layout, value is layout, id of layout, name of layout)
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
//get layout from the database (key of layout, id of layout)
function getFromDB(key, id) {
    var result = "";
    $.ajax({
        type: 'POST',
        async: false,
        url: 'LayoutConfig',
        dataType: 'text',
        data: {"layoutId" : id},
        success: function (response) {
            console.log(response);
            console.log(typeof response);
            if (response != 'failed' && response != '') {
                let ls = {};
                ls = JSON.parse(response) || {};
                console.log(ls);
                result = ls[key];
                console.log(result);
            }
            else result = null;
        }
    });
    return result;
}
//get id of layout from the database
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
//delete layout in the database
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

//get all layouts to display in the left bar, with which the user can be interact
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

//create an item in the list items in the left bar for each layout (allLayouts variable), with delete and apply buttons
function createDiv_SaveLayout(setState, name, idButton, checkHeightItem) {
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
        if (layout != null) {
            setState({ layouts: JSON.parse(JSON.stringify(layout)) });
            checkHeightItem;
        } //set layoutoverleaf
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



