import { wrap } from './searchScript';
export const legendChart = (selection, props) => {
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

    groupsEnter.append('text')
        .merge(groups.select('text'))
        .attr('class', 'text-legend')
        .text(d => d)
        .attr('dy', '2em')
        .attr('x', textOffset)
        .call(wrap, 60);
}
