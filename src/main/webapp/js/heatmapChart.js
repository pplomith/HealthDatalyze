import embed from 'vega-embed';
import { select } from 'd3';
export const heatmap = (data) => {
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "usermeta": {"embedOptions": {"renderer": "svg"}},
        "width": "container",
        "height": "container",
        "data": {
            "values": data,
            "format": {
                "type": "json"
            }
        },
        "config": {
            "view": {
                "strokeWidth": 0,
                "step": 13
            },
            "axis": {
                "domain": false
            }
        },
        "mark": {"type": "rect", "tooltip": {"content": "data"}},
        "encoding": {
            "x": {
                "field": "Patient ID",
                "type": "ordinal",
                "title": "Patient",
                "axis": {
                    "labelAngle": 0
                },
                "scale": {"bandSize": "fit"}
            },
            "y": {
                "field": "Symbol",
                "type": "ordinal",
                "title": "Gene",
                "scale": {"bandSize": "fit"}
            },
            "color": {
                "field": "Value",
                "scale": {"scheme": "redyellowgreen"},
                "type": "quantitative",
                "legend": {
                    "title": null
                }
            }
        }
    }

    // Embed the visualization in the container with id `heatmapChart`
    embed('#heatmapChart', vlSpec, {"actions": false, "mode": "vega-lite"});
}