//this script uses D3 to create a multi-line chart based on selected values.
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
import { zoom as d3Zoom } from "d3-zoom";
//function that creates the chart, exported and called in the index.js file
export const lineChart = (selection, props) => {
    //props passed from .call(linechart(...))
    const {
        yValue, //function to get the value for the y-axis
        xValue, //function to get the value for the x-axis
        margin, //margin (top, right, bottom, left) of the chart
        width, //width of the container
        height, //height of the container
        dataSelected, //data on which to create the chart
        minZoomDate, //start date of the initial zoom
        maxZoomDate //end date of the initial zoom
    } = props;
    //variables that are used to rescale the axis in the zoom
    var rescaleX, rescaleY;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    //return the value for the color based on Measurement column (used in ColorScale)
    const colorValue = d => d.Measurement;
    //creation of the doamin and the scale, based on linear scale, of the y-axis
    //extent -> domain based on the min and max value of the values in DataSelected
    var yScale = scaleLinear()
        .domain(extent(dataSelected, yValue))
        .range([innerHeight, 0]);
    rescaleY = yScale;
    //creation of the doamin and the scale, based on time scale, of the x-axis
    //extent -> domain based on the min and max value of the values in DataSelected
    var xScale = scaleTime()
        .domain(extent(dataSelected, xValue))
        .range([0, innerWidth])
        .nice();
    rescaleX = xScale;
    //color scale used to set the color of the lines,
    //based on the ordinal scale whit with the colors obtained from schemeSet1
    const colorScale = scaleOrdinal(schemeSet1);

    const g = selection.selectAll('.container').data([null]);

    const gEnter = g.enter()
        .append('g')
        .attr('class', 'container');

    gEnter.merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    //clip path delimits the zoom area (the chart does not go beyond the visible area)
    var clipPath = gEnter.append("defs")
        .append("clipPath")
        .attr("id", "clipMultiL")
        .attr("class", "clip-path")
        .append("rect")
        .attr('x',0)
        .attr('y',0)
        .attr("width", innerWidth)
        .attr("height", innerHeight);

    //y-axis creation
    var yAxis = axisLeft(yScale).tickSize(-innerWidth);
    const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
    const yAxisG = g.select('.y-axis');
    yAxisGEnter.merge(yAxisG).call(yAxis).selectAll('.domain').remove();

    //x-axis creation
    var xAxis = axisBottom(xScale).ticks(4).tickFormat(d3.timeFormat("%Y-%m-%d"));
    const xAxisGEnter = gEnter.append('g').attr('class','x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter.merge(xAxisG).call(xAxis).attr('transform', `translate(0,${innerHeight})`);

    //line generator function uses d3.line, called when lines they need to be drawn
    const lineGenerator = line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    //creation of nested values sorted by descending value, using a key (color value)
    //lastYValue indicate when previous line is finished and create a new line
    const lastYValue = d => {
        yValue(d.values[d.values.length - 1]);
    }
    const nested = nest()
        .key(colorValue)
        .entries(dataSelected)
        .sort(
            (a,b) => descending(lastYValue(a), lastYValue(b))
        );
    //set color scale domain
    colorScale.domain(nested.map(d => d.key));
    //creation of the lines
    var linePaths = g.merge(gEnter)
        .selectAll('.line-path').data(nested);
    linePaths
        .enter().append('path')
        .attr('class', 'line-path')
        .merge(linePaths)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key))
        .attr("clip-path", "url(#clipMultiL)");

    //transparent rect for event capture
    const listeningRect = gEnter
        .append('rect')
        .attr('class', 'listening-rect')
        .merge(g.select('.listening-rect'))
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent');
    //add the legend to the chart
    gEnter.append('g')
        .attr('transform', `translate(430,10)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 7,
            spacing: 25,
            textOffset: 25
        });

    //function that allows you to zoom with the mouse wheel
    var zoom = d3Zoom()
        .scaleExtent([1, 300])
        .translateExtent([[0, 0],[innerWidth, innerHeight]])
        .extent([[0, 0],[innerWidth, innerHeight]])
        .on('zoom', zoomed);
    //initial zoom setting
    //if min and max zoomDate are null, no initial zoom
    if (maxZoomDate != null && minZoomDate != null) {
        gEnter.call(zoom).transition()
            .duration(1500)
            .call(zoom.transform, d3.zoomIdentity
                .scale(innerWidth / (xScale(maxZoomDate) - xScale(minZoomDate)))
                .translate(-xScale(minZoomDate), 0));
    } else
        gEnter.call(zoom);
    //function called when the mouse wheel is moved
    function zoomed(event) {
        //event rescale of the x-axis
        var newScaleX = event.transform.rescaleX(rescaleX);
        xScale = newScaleX;

        //scale x-axis
        gEnter
            .select('.x-axis')
            .call(xAxis.scale(xScale))
            .selectAll('.domain').remove();
        //recreation of the graph lines according to the new scale
        var linePathsScaled = g.merge(gEnter)
            .selectAll('.line-path').data(nested);

        linePathsScaled
            .merge(linePathsScaled)
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
    }
};
