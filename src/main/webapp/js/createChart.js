import { scaleOrdinal, select, schemeCategory10, schemeSet1 } from 'd3';
import { lineChart } from './lineChart';
import { vitalChart } from './vitalSignsChart';
import data from "bootstrap/js/src/dom/data";
let dataSelected = [];
let allDataMain = []; //all visit data
var patient = null;
var svg_main = null; //'svg' for main line chart
var svg_main_1 = null;
var svg_main_2 = null;
var svg_main_3 = null;
var svg_main_4 = null;
var svg_heart = null; //'svg' for heart rate
var svg_respiratory = null; //'svg' for respiratory rate
var svg_systolic = null; //'svg' for systolic pressure
var svg_diastolic = null; //'svg' for dialostic pressure
var lineChartGMain = null; //'g' for main line chart
var lineChartGHR = null; //'g' for heart rate
var lineChartGRR = null; //'g' for respiratory rate
var lineChartGSP = null; //'g' for systolic pressure
var lineChartGDP = null; //'g' for dialostic pressure
var lineChartGMain_1 = null;
var lineChartGMain_2 = null;
var lineChartGMain_3 = null;
var lineChartGMain_4 = null;
var minZoomDate = null;
var maxZoomDate = null;
export const createChart = (patientData, vitalSigns, startDate, endDate) => {
    if (startDate != '' && endDate != '') {
        minZoomDate = new Date(startDate);
        maxZoomDate = new Date(endDate);
    } else if (startDate == '' || endDate == '') {
        minZoomDate = null;
        maxZoomDate = null;
    }

    allDataMain = [];
    patientData.forEach( d => {
        allDataMain.push(d);
    });


    allDataMain.forEach(d => {
       d.Value = +d.Value;
       d.Date = new Date(d.Date);
    });
    vitalSigns.forEach(d => {
        d.Date = new Date(d.Date);
        d.Value = +d.Value;
    });


    svg_main = select('#svg-main');
    svg_main.selectAll('g').remove(); //clear chart
    lineChartGMain = svg_main.append('g');

    svg_main_1 = select('#svg-main-1');
    svg_main_1.selectAll('g').remove(); //clear chart
    lineChartGMain_1 = svg_main_1.append('g');

    svg_main_2 = select('#svg-main-2');
    svg_main_2.selectAll('g').remove(); //clear chart
    lineChartGMain_2 = svg_main_2.append('g');

    svg_main_3 = select('#svg-main-3');
    svg_main_3.selectAll('g').remove(); //clear chart
    lineChartGMain_3 = svg_main_3.append('g');

    svg_main_4 = select('#svg-main-4');
    svg_main_4.selectAll('g').remove(); //clear chart
    lineChartGMain_4 = svg_main_4.append('g');

    svg_heart = select('#svg-hr');
    svg_heart.selectAll('g').remove();
    lineChartGHR = svg_heart.append('g');
    var dataHeartRate = [];
    vitalSigns.forEach(d => {
       if (d.Name == 'Heart rate')
           dataHeartRate.push(d);
    });
    render_vitalSigns_chart(dataHeartRate, 'svg-hr');

    svg_respiratory = select('#svg-rr');
    svg_respiratory.selectAll('g').remove();
    lineChartGRR = svg_respiratory.append('g');
    var dataResRate = [];
    vitalSigns.forEach(d => {
        if (d.Name == 'Respiratory rate')
            dataResRate.push(d);
    });
    render_vitalSigns_chart(dataResRate, 'svg-rr');

    svg_systolic = select('#svg-sp');
    svg_systolic.selectAll('g').remove();
    lineChartGSP = svg_systolic.append('g');
    var dataStylPress = [];
    vitalSigns.forEach(d => {
        if (d.Name == 'Systolic pressure')
            dataStylPress.push(d);
    });
    render_vitalSigns_chart(dataStylPress, 'svg-sp');

    svg_diastolic = select('#svg-dp');
    svg_diastolic.selectAll('g').remove();
    lineChartGDP = svg_diastolic.append('g');
    var dataDiasPress = [];
    vitalSigns.forEach(d => {
        if (d.Name == 'Diastolic pressure')
            dataDiasPress.push(d);
    });
    render_vitalSigns_chart(dataDiasPress, 'svg-dp');

};


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
                dataSelected.push(d);
                dataGroup.push(d);
            }
        });
        render_svg_main_n(dataGroup, "svg-main-"+(i+1));
        dataGroup = [];
    }
    render_SVG_main();
}

const render_SVG_main = () => {

    svg_main = select('#svg-main');
    svg_main.selectAll('g').remove(); //clear chart
    if (dataSelected.length > 0) {
    lineChartGMain = svg_main.append('g');

        const svgElement = document.getElementById("svg-main");
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;

        const xValue = d => d.Date;

        const yValue = d => d.Value;


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

const render_svg_main_n = (dataGroup, id) => {

    var svg_mainN = null;
    var lineChartGElement = null;

    svg_mainN = select('#'+id);
    svg_mainN.selectAll('g').remove(); //clear chart

    if (dataGroup.length > 0) {
        lineChartGElement = svg_mainN.append('g');
        const svgElement = document.getElementById(id);
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;

        const xValue = d => d.Date;

        const yValue = d => d.Value;

        const colorValue = d => d.Measurement;
        const colorScale = scaleOrdinal(schemeSet1);

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

const render_vitalSigns_chart = (vitalSignsData, id) => {
        var lineChartGElement = null;

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

        const svgElement = document.getElementById(id);
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;

    const xValue = d => d.Date;

    const yValue = d => d.Value;


    const colorValue = d => d.Name;

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
