import { scaleOrdinal, select, schemeCategory10, schemeSet1 } from 'd3';
import { lineChart } from './lineChart';
import { vitalChart } from './vitalSignsChart';
import data from "bootstrap/js/src/dom/data";
let dataSelected = [];
let allDataMain = []; //all visit data
var patient = null; //data of the selected patient
var svg_main = null; //'svg' for main line chart
var svg_main_1 = null; //first 'svg' for multi lines
var svg_main_2 = null; //second 'svg' for multi lines
var svg_main_3 = null; //third 'svg' for multi lines
var svg_main_4 = null; //four 'svg' for multi lines
var svg_heart = null; //'svg' for heart rate
var svg_respiratory = null; //'svg' for respiratory rate
var svg_systolic = null; //'svg' for systolic pressure
var svg_diastolic = null; //'svg' for dialostic pressure
var lineChartGMain = null; //'g' for main line chart
var lineChartGHR = null; //'g' for heart rate
var lineChartGRR = null; //'g' for respiratory rate
var lineChartGSP = null; //'g' for systolic pressure
var lineChartGDP = null; //'g' for dialostic pressure
var lineChartGMain_1 = null; //first 'g' in which to insert one of the multiline graphs
var lineChartGMain_2 = null; //second 'g' in which to insert one of the multiline graphs
var lineChartGMain_3 = null; //third 'g' in which to insert one of the multiline graphs
var lineChartGMain_4 = null; //four 'g' in which to insert one of the multiline graphs
var minZoomDate = null; //minimum initial zoom
var maxZoomDate = null; //maximum initial zoom
export const createChart = (patientData, vitalSigns, startDate, endDate) => {
    //setting initial zoom if selected
    if (startDate != '' && endDate != '') {
        minZoomDate = new Date(startDate);
        maxZoomDate = new Date(endDate);
    } else if (startDate == '' || endDate == '') { //otherwise null
        minZoomDate = null;
        maxZoomDate = null;
    }
    //all patient data on which to create graphs
    allDataMain = [];
    patientData.forEach( d => {
        allDataMain.push(d);
    });
    //field formatting
    allDataMain.forEach(d => {
       d.Value = +d.Value;
       d.Date = new Date(d.Date);
    });
    //field formatting for vital data
    vitalSigns.forEach(d => {
        d.Date = new Date(d.Date);
        d.Value = +d.Value;
    });
    //graph for viewing the data of interest
    svg_main = select('#svg-main');
    svg_main.selectAll('g').remove(); //clear chart
    lineChartGMain = svg_main.append('g'); //append new group
    //graphs to view the data of interest separately (1,2,3,4)
    svg_main_1 = select('#svg-main-1');
    svg_main_1.selectAll('g').remove(); //clear chart
    lineChartGMain_1 = svg_main_1.append('g'); //append new group

    svg_main_2 = select('#svg-main-2');
    svg_main_2.selectAll('g').remove(); //clear chart
    lineChartGMain_2 = svg_main_2.append('g'); //append new group

    svg_main_3 = select('#svg-main-3');
    svg_main_3.selectAll('g').remove(); //clear chart
    lineChartGMain_3 = svg_main_3.append('g'); //append new group

    svg_main_4 = select('#svg-main-4');
    svg_main_4.selectAll('g').remove(); //clear chart
    lineChartGMain_4 = svg_main_4.append('g'); //append new group
    //heart rate display chart
    svg_heart = select('#svg-hr');
    svg_heart.selectAll('g').remove(); //clear chart
    lineChartGHR = svg_heart.append('g');  //append new group
    var dataHeartRate = []; //array to store heart rate measurements
    vitalSigns.forEach(d => {
       if (d.Name == 'Heart rate')
           dataHeartRate.push(d); //get all heart rate measurements
    });
    render_vitalSigns_chart(dataHeartRate, 'svg-hr'); //creation of the chart
    //respiratory rate display chart
    svg_respiratory = select('#svg-rr');
    svg_respiratory.selectAll('g').remove(); //clear chart
    lineChartGRR = svg_respiratory.append('g'); //append new group
    var dataResRate = []; //array to store respiratory rate measurements
    vitalSigns.forEach(d => {
        if (d.Name == 'Respiratory rate')
            dataResRate.push(d); //get all respiratory rate measurements
    });
    render_vitalSigns_chart(dataResRate, 'svg-rr');  //creation of the chart
    //systolic pressure display chart
    svg_systolic = select('#svg-sp');
    svg_systolic.selectAll('g').remove(); //clear chart
    lineChartGSP = svg_systolic.append('g'); //append new group
    var dataStylPress = []; //array to store systolic pressure measurements
    vitalSigns.forEach(d => {
        if (d.Name == 'Systolic pressure')
            dataStylPress.push(d); //get all systolic pressure measurements
    });
    render_vitalSigns_chart(dataStylPress, 'svg-sp'); //creation of the chart
    //diastolic pressure display chart
    svg_diastolic = select('#svg-dp');
    svg_diastolic.selectAll('g').remove(); //clear chart
    lineChartGDP = svg_diastolic.append('g'); //append new group
    var dataDiasPress = []; //array to store diastolic pressure measurements
    vitalSigns.forEach(d => {
        if (d.Name == 'Diastolic pressure')
            dataDiasPress.push(d); //get all diastolic pressure measurements
    });
    render_vitalSigns_chart(dataDiasPress, 'svg-dp'); //creation of the chart
};
//function to update graphs based on selected measurements
export const processData = (measurementSelected) => {
    dataSelected = [];
    var dataGroup = [];

    svg_main_1 = select('#svg-main-1');
    svg_main_1.selectAll('g').remove();
    svg_main_2 = select('#svg-main-2');
    svg_main_2.selectAll('g').remove();
    svg_main_3 = select('#svg-main-3');
    svg_main_3.selectAll('g').remove();
    svg_main_4 = select('#svg-main-4');
    svg_main_4.selectAll('g').remove();

    for (var i = 0; i < measurementSelected.length; i++) {
        allDataMain.forEach(d => {
            if (d.Measurement == measurementSelected[i]) {
                dataSelected.push(d); //obtaining data based on the selected measurements
                dataGroup.push(d);
            }
        });
        render_svg_main_n(dataGroup, "svg-main-"+(i+1)); //creation of a graph to display a single measurement of interest
        dataGroup = [];
    }
    render_SVG_main(); //creation of the multiline chart
}

const render_SVG_main = () => {

    svg_main = select('#svg-main');
    svg_main.selectAll('g').remove(); //clear chart
    if (dataSelected.length > 0) {
    lineChartGMain = svg_main.append('g'); //append new group
        //obtaining the parameters of the SVG
        const svgElement = document.getElementById("svg-main");
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;
        //value of x axis
        const xValue = d => d.Date;
        //value of y axis
        const yValue = d => d.Value;
        //call to the function to create the chart
        lineChartGMain.call(lineChart, {
           yValue,
           xValue,
           margin : {
               top: 10,
               right: 160,
               bottom: 80,
               left: 40
           },
            width,
            height,
            dataSelected,
            minZoomDate,
            maxZoomDate
        });
    }
};
//function to create single graphs with the measurements of interest
const render_svg_main_n = (dataGroup, id) => {

    var svg_mainN = null;
    var lineChartGElement = null;

    svg_mainN = select('#'+id);
    svg_mainN.selectAll('g').remove(); //clear chart

    if (dataGroup.length > 0) {
        lineChartGElement = svg_mainN.append('g');
        //obtaining the parameters of the SVG
        const svgElement = document.getElementById(id);
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;
        //value of x axis
        const xValue = d => d.Date;
        //value of y axis
        const yValue = d => d.Value;
        //value for the color scale
        const colorValue = d => d.Measurement;
        const colorScale = scaleOrdinal(schemeSet1);
        //call to the function to create the chart
        lineChartGElement.call(vitalChart, {
            yValue,
            xValue,
            margin: {
                top: 15,
                right: 100,
                bottom: 20,
                left: 30
            },
            width,
            height,
            data: dataGroup,
            colorValue,
            minZoomDate,
            maxZoomDate
        });
    }
}
// function to create single graphs with the measurements of interest
const render_vitalSigns_chart = (vitalSignsData, id) => {
    var lineChartGElement = null;
    //getting the correct id of the svg
    switch (id) {
        case "svg-rr":
            lineChartGElement = lineChartGRR;
            break;
        case "svg-hr":
            lineChartGElement = lineChartGHR
            break;
        case "svg-sp":
            lineChartGElement = lineChartGSP;
            break;
        case "svg-dp":
            lineChartGElement = lineChartGDP;
            break;
    }
    //obtaining the parameters of the SVG
    const svgElement = document.getElementById(id);
    const width = svgElement.viewBox.baseVal.width;
    const height = svgElement.viewBox.baseVal.height;
    //value of x axis
    const xValue = d => d.Date;
    //value of y axis
    const yValue = d => d.Value;
    //value for the color scale
    const colorValue = d => d.Name;
    //call to the function to create the chart
    lineChartGElement.call(vitalChart, {
            yValue,
            xValue,
            margin : {
                top: 15,
                right: 100,
                bottom: 20,
                left: 30
            },
            width,
            height,
            data: vitalSignsData,
            colorValue,
            minZoomDate,
            maxZoomDate
        });
}
