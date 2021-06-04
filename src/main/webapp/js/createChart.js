import {select} from 'd3';
import { lineChart } from './lineChart';
let dataSelected = [];
let allData = [];
var patient = null;
var svg = null;
var lineChartG = null;
export const createChart = (patientSelected) => {
    allData = [];
    patientSelected.forEach( d => {
        allData.push(d);
    });
    patient = allData.shift();
    console.log("createChart");

    allData.forEach(d => {
       d.Value = +d.Value;
       d.Date = new Date(d.Date);
    });

    console.log(allData);

    svg = select('#svg-main');
    svg.selectAll('g').remove(); //clear chart
    lineChartG = svg.append('g');

};


export const processData = (measurementSelected) => {
    dataSelected = [];
    for (var i = 0; i < measurementSelected.length; i++) {
        allData.forEach(d => {
            if (d.Measurement == measurementSelected[i]) {
                dataSelected.push(d);
            }
        });
    }
    console.log("data selected");
    console.log(dataSelected);
    render();
}

const render = () => {

    svg = select('#svg-main');
    svg.selectAll('g').remove(); //clear chart
    if (dataSelected.length > 0) {
    lineChartG = svg.append('g');

        const svgElement = document.getElementById("svg-main");
        const width = svgElement.viewBox.baseVal.width;
        const height = svgElement.viewBox.baseVal.height;

        const xValue = d => d.Date;

        const yValue = d => d.Value;

        lineChartG.call(lineChart, {
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
            dataSelected
        });

    }
};
// const svg = select('svg');
//
