import React from "react";
import ReactDOM from "react-dom";
import { Responsive, WidthProvider } from 'react-grid-layout';
import Collapsible from "react-collapsible";
const ResponsiveGridLayout = WidthProvider(Responsive);

//class that crates a dashboard
var layoutsInit = {
    lg:[
        {i: "search", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 2, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3},
        {i: "filter", x: 5, y: 1, w: 5, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 3, minH: 5}
    ],
    md: [
        {i: "search", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 2, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3},
        {i: "filter", x: 5, y: 1, w: 5, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 3, minH: 5}
    ],
    sm: [
        {i: "search", x: 0, y: 0, w: 3, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 3, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 3, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 2, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 2, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 3, y: 0, w: 2, h: 3, minW: 2, minH: 3},
        {i: "filter", x: 4, y: 1, w: 3, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 4, y: 2, w: 3, h: 10, minW: 3, minH: 5}
    ],
    xs: [
        {i: "search", x: 0, y: 0, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 1, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 3},
        {i: "filter", x: 3, y: 1, w: 2, h: 4, minW: 2, minH: 3},
        {i: "graph", x: 3, y: 2, w: 2, h: 10, minW: 2, minH: 5}
    ],
    xxs: [
        {i: "search", x: 0, y: 3, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "tablePatient", x: 0, y: 4, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 5, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tableDataVisit", x: 0, y: 6, w: 2, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 0, y: 7, w: 2, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 1},
        {i: "filter", x: 0, y: 1, w: 2, h: 4, minW: 2, minH: 3},
        {i: "graph", x: 0, y: 2, w: 2, h: 8, minW: 2, minH: 5}
    ]
};

const originalLayouts = getFromDB("layouts", '1');
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
            className: "layouts",
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            rowHeight: 30
        };
    }

    resetLayout() {
        this.setState({ layouts: layoutsInit });
    }

    onLayoutChange(layout, layouts) {
        saveToDB("layouts", layouts, '1', 'localStorage');
        this.setState({ layouts });
    }

    saveLayout() {

        var name = $('#newName').val();
        var idButton = getIdfromDB();
        saveToDB("layouts", this.state.layouts, idButton, name);
        createDiv_SaveLayout(this.setState.bind(this),name, idButton);
        $('#newName').val("New Layout");

    }

    componentDidMount() {
        var obj = JSON.parse(allLayouts)
        $('#layouts-list').attr("aria-expanded","false");
        $('#layouts-list').addClass("collapsed");
        for (var i = 1; i < Object.keys(obj).length; i++){
            createDiv_SaveLayout(this.setState.bind(this), obj[i].layoutName, obj[i].layoutId);
        }
    }

    render() {
        return (
            <div className="d-flex" id="wrapper">
                {/*Modal*/}
                <div className={"modal fade"} id={"modalLayout"} role={"dialog"}>
                    <div className={"modal-dialog"}>

                        <div className={"modal-content"}>
                            <div className={"modal-header"}>
                                <button type={"button"} className={"close"} data-dismiss={"modal"}>&times;</button>
                                <h4 className={"modal-title"}>Layout Saving</h4>
                            </div>
                            <div className={"modal-body"}>
                                <label>Insert name: </label>
                                <input id={"newName"} type={"text"} defaultValue={"New Layout"}></input>
                            </div>
                            <div className={"modal-footer"}>
                                <button type={"button"} className={"btn btn-default"} id={"name-saved"}
                                        data-dismiss={"modal"} onClick={() => this.saveLayout()}>Save
                                </button>
                                <button type={"button"} className={"btn btn-default"} data-dismiss={"modal"}>Close</button>
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
                                    <span className={"menu-collapsed"}>Layouts</span>
                                    <span className={"submenu-icon ml-auto"}></span>
                                </div>
                            </a>
                            <div id={"layout-div"}>
                                <div id={'submenu1'} className={"submenu1 sidebar-submenu collapse show"}>
                                    <a href={"javascript:void(0);"} className={"layouts-div list-group-item list-group-item-action text-black"}>
                                        <div>
                                            <button className={"btn btn-primary"} id={"add-layout"} data-toggle={"modal"} data-target={"#modalLayout"} value={"1"}>
                                                ADD
                                            </button>
                                            <button className={"btn btn-primary"} onClick={() => this.resetLayout()}>
                                                RESET
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
                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                    rowHeight={30}
                    layouts={this.state.layouts}
                    onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
                >

                    <div key="search" className={"searchDiv"} data-grid={{x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1}}>
                        <span><i className={"fa fa-search"}></i></span>
                        <input type="text" className={"search_patient"} id={"searchPatient"} placeholder={"Search..."}
                        />
                    </div>





                            <div id={"patients"} key="tablePatient" className={"table_patient"} data-grid={{x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 3}}>
                                <div className={"table-responsive"} id={"allPatients"}>
                                    <table id={"tableAllPatient"} className={"table table-hover nowrap"}
                                           style={{width:100 + '%'}}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>NAME</th>
                                            <th>GENDER</th>
                                            <th>DATE OF BIRTH</th>
                                            <th>BLOOD TYPE</th>
                                            <th>HEIGHT</th>
                                        </tr>
                                        </thead>
                                        <tbody id={"patientTableBody"}>
                                        </tbody>
                                    </table>

                                </div>
                            </div>


                    <div key="tabelVisitPatient" className={"table_visit_patient"} data-grid={{x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 3}}>
                        <div className={"table-responsive"}>
                            <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>VISIT DATE</th>
                                    <th>INFORMATION</th>
                                </tr>
                                </thead>
                                <tbody id={"tableVisitDate"}>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div key="tableDataVisit" className={"table_data_visit"} data-grid={{x: 0, y: 3, w: 3, h: 5, minW: 2, minH: 3}}>
                        <div className={"table-responsive"}>
                            <table className={"table table-hover nowrap"} style={{width:100+'%'}}>
                                <thead>
                                <tr>
                                    <th>MEASUREMENT</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody id={"measurementTable"}>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div key="noteVisit" className={"div_note_visit"} data-grid={{x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3}}>
                        <div id={"titleNote"}>NOTE</div>
                        <p id={"noteVisit"}>NO NOTE</p>
                    </div>


                    <div key="patientInfo" className={"personal_info"} data-grid={{x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3}}>
                        <div>
                            <h3 id={"patientName"}> NO PATIENT SELECTED </h3>
                        </div>
                        <div className={"informationTable"}>
                            <div className={"p-2 d-flex stats"}>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>AGE</span><span
                                    id={"ageSpan"}>-</span></div>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>SEX</span><span
                                    id={"sexSpan"}>-</span></div>
                                <div className={"d-flex flex-column"}><span className={"titleSpan"}>BLOOD</span><span
                                    id={"bloodSpan"}>-</span></div>
                            </div>
                        </div>
                    </div>

                    <div key="filter" className={"div_filter"} data-grid={{x: 5, y: 1, w: 5, h: 1}}>
                            <div key="filter" className={"div_filter"} data-grid={{x: 5, y: 1, w: 5, h: 4, minW: 3, minH: 3}}>
                                <div id={"titleFilter"}></div>
                                </div>
                    </div>
                    <div key="graph" className={"div_graph"} id={"containerSvg"} data-grid={{x: 5, y: 2, w: 5, h: 11, minW: 3, minH: 5}}>
                        <div id={"titleGraph"}><select id={"selectValue"} multiple={'multiple'} name={'measurement[]'}>
                        </select></div>
                        <svg id={"svgId"} viewBox={"0 0 600 400"}>
                        </svg>
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
            console.log("eliminato ? "+response);
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
            console.log(response);
            result = response;
        }
    });
    return result;
}

function createDiv_SaveLayout(setState, name, idButton) {
    // item creation
    //main <div>
    var newLayout = document.createElement("div");
    newLayout.classList.add('collapse','sidebar-submenu', 'show','submenu1');
    newLayout.id = "submenu"+idButton;
    //second <a>
    var newA = document.createElement("a");
    newA.href = "javascript:void(0);";
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



