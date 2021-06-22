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
import {nest} from 'd3-collection';
import { zoom as d3Zoom } from 'd3-zoom';
import React from "react";
export const vitalChart = (selection, props) => {
    const {
        yValue,
        xValue,
        margin,
        width,
        height,
        data,
        colorValue
    } = props;
    console.log(data);
    var zoomRescaleX, zoomRescaleY;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colorScale = scaleOrdinal()
        .range(['red']);

    var yScale = scaleLinear()
        .domain([0, max(data, yValue)])
        .range([innerHeight, 0]);

    zoomRescaleY = yScale;

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

    var clipPath = gEnter.append('defs') //clip path delimits the zoom area
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr("width", innerWidth)
        .attr("height", innerHeight + 10)
        .attr('transform', `translate(0, -10)`);;

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

    var yAxis = axisLeft(yScale).ticks(3).tickSize(-innerWidth);
    const yAxisGEnter = gEnter
        .append('g')
        .attr('class', 'y-axis');
    const yAxisG = g.select('.y-axis');
    yAxisGEnter
        .merge(yAxisG)
        .call(yAxis)
        .selectAll('.domain').remove();

    //create line
    const lineGenerator = line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    const lastYValue = d => {
        yValue(d.values[d.values.length - 1]);
    }
    const nested = nest()
        .key(colorValue)
        .entries(data)
        .sort(
            (a, b) => descending(lastYValue(a), lastYValue(b))
        );

    colorScale.domain(nested.map(d => d.key));

    var linePaths = g.merge(gEnter)
        .selectAll('.line-path-vs').data(nested);
    linePaths
        .enter().append('path')
        .attr('class', 'line-path-vs')
        .merge(linePaths)
        .attr('d', d => lineGenerator(d.values))
        .attr('stroke', d => colorScale(d.key))
        .attr("clip-path", "url(#clip)");

    //create area
    const areaGenerator = area()
        .x(d => xScale(xValue(d)))
        .y0(innerHeight)
        .y1(d => yScale(yValue(d)));

    var linePathsArea = g.merge(gEnter)
        .selectAll('.line-path-vs-area').data(nested);
    linePathsArea
        .enter().append('path')
        .attr('class', 'line-path-vs-area')
        .merge(linePathsArea)
        .attr('d', d => areaGenerator(d.values))
        .attr('fill', d => colorScale(d.key))
        .attr("clip-path", "url(#clip)");


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

    gEnter.append('g')
        .attr('transform', `translate(500,20)`)
        .call(legendChart, {
            colorScale,
            circleRadius: 7,
            spacing: 25,
            textOffset: -23
        });

    var focus = gEnter.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

    focus.append('rect')
        .attr('class','tooltip-svg')
        .attr('width', 90)
        .attr('height', 35)
        .attr('x', 10)
        .attr("y", -15)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 15)
        .attr("y", -2);

    focus.append("text")
        .attr('class', 'tooltip-marker')
        .attr("x", 15)
        .attr("y", 10)
        .text("Value:");

    focus.append("text")
        .attr("class", "tooltip-value")
        .attr("x", 45)
        .attr("y", 10);

    const listeningRect = gEnter //rect for event capture
        .append('rect')
        .attr('class', 'listening-rect')
        .merge(g.select('.listening-rect'))
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .on('mousemove', onMouseMove)
        .on("mouseover", function() { focus.style("display", null);  tooltipCircle.style('opacity', 1); })
        .on("mouseout", function() { focus.style("display", "none"); tooltipCircle.style('opacity', 0); });;



    // const tooltip = select('#tooltip'); //tooltip to view information
    const tooltipCircle = gEnter.append('g') //line circle
        .append('circle')
        .attr('class', 'tooltip-circle')
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('fill-opacity', '0.4')
        .style('opacity', 0)
        .merge(g.select('.tooltip-circle'));

    gEnter.call(zoom);

    function zoom(gEnter) {
        var extent = [
            [0, 0],
            [innerWidth, innerHeight]
        ];

        var zooming = d3Zoom()
            .scaleExtent([1, 2])
            .translateExtent(extent)
            .extent(extent)
            .on('zoom', zoomed);

        gEnter.call(zooming);
    }

    function zoomed(event) {
        var newScaleX = event.transform.rescaleX(zoomRescaleX);
        xScale = newScaleX;


        //scale x-axis
        gEnter
            .select('.x-axis')
            .call(xAxis.scale(xScale))
            .selectAll('.domain').remove();


        var linePathsScaled = g.merge(gEnter)
            .selectAll('.line-path-vs').data(nested);

        linePathsScaled
            .merge(linePathsScaled)
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));

        const linePathsAreaScaled = g.merge(gEnter)
            .selectAll('.line-path-vs-area').data(nested);

        linePathsAreaScaled
            .merge(linePathsAreaScaled)
            .attr('d', d => areaGenerator(d.values))
            .attr('fill', d => colorScale(d.key));

        const circles = g.merge(gEnter)
            .selectAll('circle').data(data);

        circles
            .merge(circles)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)));

    }


    var bisect = bisector(function(d) { return d.Date; }).left;

    function onMouseMove() {

        var x0 = xScale.invert(pointer(event,this)[0]);
        var y0 = yScale.invert(pointer(event,this)[1]);

        var valueHovered = bisect(data, x0);
        var getData = data[valueHovered];

        if (getData != undefined) {
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

