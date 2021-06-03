import embed from 'vega-embed';

export const heatmap = () => {
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "url": "heatmap.csv"
        },
        //"title": "Daily Max Temperatures (C) in Seattle, WA",
        "config": {
            "view": {
                "strokeWidth": 0,
                "step": 13
            },
            "axis": {
                "domain": false
            }
        },
        "mark": "rect",
        "encoding": {
            "x": {
                "field": "date",
                "timeUnit": "date",
                "type": "ordinal",
                "title": "Day",
                "axis": {
                    "labelAngle": 0,
                    "format": "%e"
                }
            },
            "y": {
                "field": "date",
                "timeUnit": "month",
                "type": "ordinal",
                "title": "Month"
            },
            "color": {
                "field": "temp_max",
                "scale": {"scheme": "redyellowgreen"},
                "aggregate": "max",
                "type": "quantitative",
                "legend": {
                    "title": null
                }
            }
        }
    }

    // Embed the visualization in the container with id `vis`
    embed('#vis', vlSpec, {"actions": false, "mode": "vega-lite"});
}