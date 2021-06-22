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
    descending,
    schemeSet1
} from 'd3';
import { nest } from 'd3-collection';
import { colorLegend } from './colorLegend';
import {zoom as d3Zoom} from "d3-zoom";
export const lineChart = (selection, props) => {
    const {
        yValue,
        xValue,
        margin,
        width,
        height,
        dataSelected
    } = props;
    var rescaleX, rescaleY;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colorValue = d => d.Measurement;

    var yScale = scaleLinear()
        .domain(extent(dataSelected, yValue))
        .range([innerHeight, 0]);
    rescaleY = yScale;

    var xScale = scaleTime()
        .domain(extent(dataSelected, xValue))
        .range([0, innerWidth])
        .nice();
    rescaleX = xScale;

    const colorScale = scaleOrdinal(schemeSet1);

    const g = selection.selectAll('.container').data([null]);

    const gEnter = g.enter()
        .append('g')
        .attr('class', 'container');

    gEnter.merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);


    var clipPath = gEnter.append("defs") //clip path delimits the zoom area
        .append("clipPath")
        .attr("id", "clipMultiL")
        .attr("class", "clip-path")
        .append("rect")
        .attr('x',0)
        .attr('y',0)
        .attr("width", innerWidth)
        .attr("height", innerHeight);

    var yAxis = axisLeft(yScale).tickSize(-innerWidth);
    const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
    const yAxisG = g.select('.y-axis');
    yAxisGEnter.merge(yAxisG).call(yAxis).selectAll('.domain').remove();


    var xAxis = axisBottom(xScale).ticks(4).tickFormat(d3.timeFormat("%Y-%m-%d"));
    const xAxisGEnter = gEnter.append('g').attr('class','x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter.merge(xAxisG).call(xAxis).attr('transform', `translate(0,${innerHeight})`);


    const lineGenerator = line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

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
        .attr('stroke', d => colorScale(d.key))
        .attr("clip-path", "url(#clipMultiL)");


    const listeningRect = gEnter //rect for event capture
        .append('rect')
        .attr('class', 'listening-rect')
        .merge(g.select('.listening-rect'))
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent');

    gEnter.append('g')
        .attr('transform', `translate(430,10)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 7,
            spacing: 25,
            textOffset: 25
        });

    gEnter.call(zoom);

    function zoom(gEnter) {
        var extent = [
            [0, 0],
            [innerWidth, innerHeight]
        ];

        var zooming = d3Zoom()
            .scaleExtent([1, 300])
            .translateExtent(extent)
            .extent(extent)
            .on('zoom', zoomed);

        gEnter.call(zooming);
    }

    function zoomed(event) {
        var newScaleX = event.transform.rescaleX(rescaleX);
        xScale = newScaleX;


        //scale x-axis
        gEnter
            .select('.x-axis')
            .call(xAxis.scale(xScale))
            .selectAll('.domain').remove();

        var linePathsScaled = g.merge(gEnter)
            .selectAll('.line-path').data(nested);

        linePathsScaled
            .merge(linePathsScaled)
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
    }
};
