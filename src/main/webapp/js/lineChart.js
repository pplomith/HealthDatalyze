import {
    pointer,
    select,
    scaleLinear,
    scaleTime,
    axisBottom,
    axisLeft,
    line,
    curveBasis,
    bisector,
    timeParse,
    mouse,
    max,
    extent,
    scaleOrdinal,
    schemeCategory10,
    descending
} from 'd3';
import { nest } from 'd3-collection';
import { colorLegend } from './colorLegend';
export const lineChart = (selection, props) => {
    const {
        yValue,
        xValue,
        margin,
        width,
        height,
        dataSelected
    } = props;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colorValue = d => d.Measurement;

    const yScale = scaleLinear()
        .domain(extent(dataSelected, yValue))
        .range([innerHeight, 0]);

    const xScale = scaleTime()
        .domain(extent(dataSelected, xValue))
        .range([0, innerWidth])
        .nice();

    const colorScale = scaleOrdinal(schemeCategory10);

    const g = selection.selectAll('.container').data([null]);

    const gEnter = g.enter()
        .append('g')
        .attr('class', 'container');

    gEnter.merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);


    const yAxis = axisLeft(yScale);
    const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
    const yAxisG = g.select('.y-axis');
    yAxisGEnter.merge(yAxisG).call(yAxis);

    const xAxis = axisBottom(xScale);
    const xAxisGEnter = gEnter.append('g').attr('class','x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter.merge(xAxisG).call(xAxis).attr('transform', `translate(0,${innerHeight})`);

    const lineGenerator = line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(curveBasis);

    const lastYValue = d => {
        yValue(d.values[d.values.length - 1]);
    }
    const nested = nest()
        .key(colorValue)
        .entries(dataSelected)
        .sort(
            (a,b) => descending(lastYValue(a), lastYValue(b))
        );

    colorScale.domain(nested.map(d => d.key));

    var linePaths = g.merge(gEnter)
        .selectAll('.line-path').data(nested);
    linePaths
        .enter().append('path')
        .attr('class', 'line-path')
        .merge(linePaths)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key));

    gEnter.append('g')
        .attr('transform', `translate(400,10)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 7,
            spacing: 25,
            textOffset: 25
        });
};
