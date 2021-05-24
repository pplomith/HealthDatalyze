import React from "react";
import ReactDOM from "react-dom";
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);
//class that crates a dashboard
var layouts = {
    lg:[
        {i: "search", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 2, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3},
        {i: "filter", x: 5, y: 1, w: 5, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 2, minH: 3}
    ],
    md: [
        {i: "search", x: 0, y: 0, w: 5, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 5, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 3, h: 5, minW: 2, minH: 3},
        {i: "noteVisit", x: 3, y: 3, w: 2, h: 5, minW: 2, minH: 3},
        {i: "patientInfo", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 3},
        {i: "filter", x: 5, y: 1, w: 5, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 5, y: 2, w: 5, h: 11, minW: 2, minH: 3}
    ],
    sm: [
        {i: "search", x: 0, y: 0, w: 3, h: 1, minW: 3, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 3, h: 6, minW: 3, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 3, h: 6, minW: 3, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 2, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 2, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 3, y: 0, w: 2, h: 3, minW: 2, minH: 3},
        {i: "filter", x: 4, y: 1, w: 3, h: 4, minW: 3, minH: 3},
        {i: "graph", x: 4, y: 2, w: 3, h: 10, minW: 2, minH: 3}
    ],
    xs: [
        {i: "search", x: 0, y: 0, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "tablePatient", x: 0, y: 1, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 2, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tableDataVisit", x: 0, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 1, y: 3, w: 1, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 3},
        {i: "filter", x: 3, y: 1, w: 2, h: 4, minW: 2, minH: 3},
        {i: "graph", x: 3, y: 2, w: 2, h: 10, minW: 2, minH: 3}
    ],
    xxs: [
        {i: "search", x: 0, y: 3, w: 2, h: 1, minW: 2, maxH: 1},
        {i: "tablePatient", x: 0, y: 4, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tabelVisitPatient", x: 0, y: 5, w: 2, h: 6, minW: 2, minH: 3},
        {i: "tableDataVisit", x: 0, y: 6, w: 2, h: 4, minW: 1, minH: 3},
        {i: "noteVisit", x: 0, y: 7, w: 2, h: 4, minW: 1, minH: 3},
        {i: "patientInfo", x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 1},
        {i: "filter", x: 0, y: 1, w: 2, h: 4, minW: 2, minH: 3},
        {i: "graph", x: 0, y: 2, w: 2, h: 8, minW: 2, minH: 3}
    ]
};
export class MyFirstGrid extends React.Component {

    render() {

        return (
            <ResponsiveGridLayout className="layout" layouts={layouts} rowHeight={30}
                                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 520, xxs: 0}}
                                  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} >

                <div key="search" className={"searchDiv"}>
                    <span><i className={"fa fa-search"}></i></span>
                    <input type="text" className={"search_patient"} id={"searchPatient"} placeholder={"Search..."}
                    />
                </div>


                <div key="tablePatient" className={"table_patient"}>
                    <div className={"table-responsive"}>
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

                <div key="tabelVisitPatient" className={"table_visit_patient"}>
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


                <div key="tableDataVisit" className={"table_data_visit"}>
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

                <div key="noteVisit" className={"div_note_visit"}>
                    <div id={"titleNote"}>NOTE</div>
                    <p id={"noteVisit"}>NO NOTE</p>
                </div>


                <div key="patientInfo" className={"personal_info"}>
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

                <div key="filter" className={"div_filter"}>
                    <div id={"titleFilter"}>FILTERS</div>
                </div>
                <div key="graph" className={"div_graph"} id={"containerSvg"}>
                    <div id={"titleGraph"}>HEALTH DATA</div>
                    <svg id={"svgId"} viewBox={"0 0 600 400"}>
                    </svg>
                </div>
            </ResponsiveGridLayout>
        )
    }
}

