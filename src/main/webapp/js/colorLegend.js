export const colorLegend = (selection, props) => {
    const {
        colorScale,
        circleRadius,
        spacing,
        textOffset
    } = props;

    const groups = selection.selectAll('g')
        .data(colorScale.domain());
    const groupsEnter = groups
        .enter().append('g')
        .attr('class', 'tick-legend');
    groupsEnter
        .merge(groups)
        .attr('transform', (d, i) =>
            `translate(0, ${i * spacing})`
        );
    groups.exit().remove();

    groupsEnter.append('rect')
        .merge(groups.select('rect'))
        .attr('height', 2)
        .attr('width', 15)
        .attr('fill', colorScale);

    groupsEnter.append('text')
        .merge(groups.select('text'))
        .attr('class', 'text-legend')
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
}