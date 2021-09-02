//this script uses D3 to create a single-line chart.
import {
    pointer,
    select,
    scaleLinear,
    scaleTime,
    axisBottom,
    axisLeft,
    extent,
    line,
    max,
    scaleOrdinal,
    schemeCategory10,
    area,
    descending,
    timeFormat,
    bisector
} from 'd3';
import { legendChart } from './legendChart';
import { nest } from 'd3-collection';
import { zoom as d3Zoom } from 'd3-zoom';
import React from "react";
//function that creates the chart, exported and called in the index.js file
export const vitalChart = (selection, props) => {
    //props passed from .call(vitalChart(...))
    const {
        yValue, //function to get the value for the y-axis
        xValue, //function to get the value for the x-axis
        margin, //margin (top, right, bottom, left) of the chart
        width, //width of the container
        height, //height of the container
        data, //data on which to create the chart
        colorValue,
        minZoomDate, //start date of the initial zoom
        maxZoomDate //end date of the initial zoom
    } = props;
    //variables that are used to rescale the axis in the zoom
    var zoomRescaleX, zoomRescaleY;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    //color scale used to set the color of the lines,
    //based on the ordinal scale and in this case use only red color
    const colorScale = scaleOrdinal()
        .range(['red']);

    //creation of the doamin and the scale, based on linear scale, of the y-axis
    //extent -> domain based on the min and max value of the values in DataSelected
    var yScale = scaleLinear()
        .domain([0, max(data, yValue)])
        .range([innerHeight, 0]);

    zoomRescaleY = yScale;

    //creation of the doamin and the scale, based on time scale, of the x-axis
    //extent -> domain based on the min and max value of the values in DataSelected
    var xScale = scaleTime()
        .domain(extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    zoomRescaleX = xScale;

    const g = selection.selectAll('.container').data([null]);

    const gEnter = g.enter()
        .append('g')
        .attr('class', 'container');

    gEnter.merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    //clip path delimits the zoom area (the chart does not go beyond the visible area)
    var clipPath = gEnter.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr("width", innerWidth)
        .attr("height", innerHeight + 10)
        .attr('transform', `translate(0, -10)`);;
    //x-axis creation
    var xAxis = axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%Y-%m-%d"));
    const xAxisGEnter = gEnter
        .append('g')
        .attr('class', 'x-axis');
    const xAxisG = g.select('.x-axis');
    xAxisGEnter
        .merge(xAxisG)
        .call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisGEnter.selectAll('.domain').remove();
    //y-axis creation
    var yAxis = axisLeft(yScale).ticks(3).tickSize(-innerWidth);
    const yAxisGEnter = gEnter
        .append('g')
        .attr('class', 'y-axis');
    const yAxisG = g.select('.y-axis');
    yAxisGEnter
        .merge(yAxisG)
        .call(yAxis)
        .selectAll('.domain').remove();

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
        .entries(data)
        .sort(
            (a, b) => descending(lastYValue(a), lastYValue(b))
        );
    //set color scale domain
    colorScale.domain(nested.map(d => d.key));
    //creation of the lines
    var linePaths = g.merge(gEnter)
        .selectAll('.line-path-vs').data(nested);
    linePaths
        .enter().append('path')
        .attr('class', 'line-path-vs')
        .merge(linePaths)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key))
        .attr("clip-path", "url(#clip)");

    //area generator function uses d3.area, called when area of the lines they need to be drawn
    const areaGenerator = area()
        .x(d => xScale(xValue(d)))
        .y0(innerHeight)
        .y1(d => yScale(yValue(d)));
    //creation of the area for each line
    var linePathsArea = g.merge(gEnter)
        .selectAll('.line-path-vs-area').data(nested);
    linePathsArea
        .enter().append('path')
        .attr('class', 'line-path-vs-area')
        .merge(linePathsArea)
        .attr('d', d => areaGenerator(d.values))
        .attr('fill', d => colorScale(d.key))
        .attr("clip-path", "url(#clip)");

    //addition of circles that highlight the data
    var circles = g.merge(gEnter)
        .selectAll('circle').data(data);
    circles
        .enter().append('circle')
        .attr('cy', innerHeight / 2)
        .attr('cx', innerHeight / 2)
        .attr('r', 0)
        .merge(circles)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 1.3)
        .attr('stroke', d => colorScale(d.Name))
        .attr('fill', d => colorScale(d.Name))
        .attr('stroke-width', 1.5)
        .attr("clip-path", "url(#clip)");
    //add the legend to the chart
    gEnter.append('g')
        .attr('transform', `translate(500,20)`)
        .call(legendChart, {
            colorScale,
            circleRadius: 7,
            spacing: 25,
            textOffset: -23
        });
    //add a tooltip that showing the hover value
    var focus = gEnter.append('g')
        .attr('class', 'focus')
        .style('display', 'none');
    //rect for the tooltip
    focus.append('rect')
        .attr('class','tooltip-svg')
        .attr('width', 90)
        .attr('height', 35)
        .attr('x', 10)
        .attr("y", -15)
        .attr("rx", 4)
        .attr("ry", 4);
    //shows the date in the tolltip
    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 15)
        .attr("y", -2);
    //shows Value: label in the tolltip
    focus.append("text")
        .attr('class', 'tooltip-marker')
        .attr("x", 15)
        .attr("y", 10)
        .text("Value:");
    //shows the data value in the tolltip
    focus.append("text")
        .attr("class", "tooltip-value")
        .attr("x", 45)
        .attr("y", 10);
    //transparent rect for event capture
    const listeningRect = gEnter
        .append('rect')
        .attr('class', 'listening-rect')
        .merge(g.select('.listening-rect'))
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .on('mousemove', onMouseMove)
        .on("mouseover", function() { focus.style("display", null);  tooltipCircle.style('opacity', 1); })
        .on("mouseout", function() { focus.style("display", "none"); tooltipCircle.style('opacity', 0); });;

    //circle moving with the tooltip
    const tooltipCircle = gEnter.append('g')
        .append('circle')
        .attr('class', 'tooltip-circle')
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('fill-opacity', '0.4')
        .style('opacity', 0)
        .merge(g.select('.tooltip-circle'));

    //function that allows you to zoom with the mouse wheel
    var zoom = d3Zoom()
        .scaleExtent([1, 2])
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
        var newScaleX = event.transform.rescaleX(zoomRescaleX);
        xScale = newScaleX;


        //scale x-axis
        gEnter
            .select('.x-axis')
            .call(xAxis.scale(xScale))
            .selectAll('.domain').remove();

        //recreation of the graph lines according to the new scale
        var linePathsScaled = g.merge(gEnter)
            .selectAll('.line-path-vs').data(nested);

        linePathsScaled
            .merge(linePathsScaled)
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
        //recreation of the graph areas according to the new scale
        const linePathsAreaScaled = g.merge(gEnter)
            .selectAll('.line-path-vs-area').data(nested);

        linePathsAreaScaled
            .merge(linePathsAreaScaled)
            .attr('d', d => areaGenerator(d.values))
            .attr('fill', d => colorScale(d.key));
        //recreation of the circles according to the new scale
        const circles = g.merge(gEnter)
            .selectAll('circle').data(data);

        circles
            .merge(circles)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)));

    }


    var bisect = bisector(function(d) { return d.Date; }).left;
    //shows the tooltip and called when moving mouse in the rect
    function onMouseMove() {
        //inverts the pixel coordinates indicated by the mouse pointer to a numeric value
        var x0 = xScale.invert(pointer(event,this)[0]);
        var y0 = yScale.invert(pointer(event,this)[1]);
        //obtaining value with bisection in the data coordinates
        var valueHovered = bisect(data, x0);
        //get value from array
        var getData = data[valueHovered];

        if (getData != undefined) {
            //formatting of the values and showing the tooltip
            var date = new Date(getData.Date);
            const formatDate = timeFormat('%B %-d, %Y');

            const x = xScale(getData.Date) + margin.left;
            const y = yScale(getData.Value) + margin.top;

            focus.attr("transform", `translate(` + xScale(getData.Date) + `,` + yScale(getData.Value) + `)`);

            focus.select('.tooltip-date').text(formatDate(date));
            focus.select('.tooltip-value').text((Math.round(getData.Value * 100) /100));

            tooltipCircle
                .attr('cx', xScale(getData.Date))
                .attr('cy', yScale(getData.Value))

            tooltipCircle.style('opacity', 1);
        }
    }

}

