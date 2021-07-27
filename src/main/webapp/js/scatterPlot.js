import embed from 'vega-embed';
export const scatterplot = (data, valueSelected, patient) => {

    var paramsSetting = [{"name": "pts", "select": {"type" : "point", "fields" :  ["id"]}, "value" : [{"id" : patient}] }];
    var defaultParams = [{"name": "pts", "select": "point"}];
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "usermeta": {"embedOptions": {"renderer": "svg"}},
        "params": (patient != null) ? paramsSetting : defaultParams,
        "data": {
            "values": data,
            "format": {
                "type": "json"
            }
        },
        "mark": {"type": "point", "tooltip": {"content": "data"}},
        "encoding": {
            "x": {
                "field": "PC1",
                "type": "quantitative",
                "scale": {"zero": false}
            },
            "y": {
                "field": "PC2",
                "type": "quantitative",
                "scale": {"zero": false}
            },
            "color": {
                "condition": {
                    "param": "pts",
                    "field": valueSelected,
                    "type": "nominal"
                },
                "value": "grey"
            },
            "shape": {"field": valueSelected, "type": "nominal"},
            "size": {
                "condition": {"param": "pts", "empty": false, "value": 300},
                "value": 50
            }
        }
    };

    // Embed the visualization in the container with id `scatterPlot`
    embed('#scatterPlotChart', vlSpec, {"actions": false, "mode": "vega-lite"});

}