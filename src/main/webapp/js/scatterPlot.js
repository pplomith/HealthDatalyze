import embed from 'vega-embed';
//function to create scatter chart
export const scatterplot = (data, valueSelected, patient) => {
    //custom params (selected patient)
    var paramsSetting = [{"name": "pts", "select": {"type" : "point", "fields" :  ["id"]}, "value" : [{"id" : patient}] }];
    //default params (no selected patient)
    var defaultParams = [{"name": "pts", "select": "point"}];
    //chart spec
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
                    "field": valueSelected,
                    "type": "nominal"
            },
            "shape": {"field": valueSelected, "type": "nominal"},
            "size": {
                "condition": {"param": "pts", "empty": false, "value": 300},
                "value": 50
            }
        }
    };

    // Embed the visualization in the container with id `scatterPlotChart`
    embed('#scatterPlotChart', vlSpec, {"actions": false, "mode": "vega-lite"});

}