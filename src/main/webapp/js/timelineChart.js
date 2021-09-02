import {DataSet, Timeline} from "vis-timeline/standalone";

export const timelineChart = (data, minZoomDate, maxZoomDate) => {
    //initial zoom setting
    var today = new Date();
    var start = today.toString(), end = today.toString();
    if (minZoomDate != '' && maxZoomDate != '') {
        start = minZoomDate;
        end = maxZoomDate;
    }
    //delete the old chart
    $('#timelineChart').empty();
    // DOM element where the Timeline will be attached
    var container = document.getElementById('timelineChart');
    //static data groups
    //id = 100 => MEDICINE
    //id = 101 => EVENTS
    //id = 102 => CLINICAL ANALISYS
    var dataGroups = [{
        groups: [
            {
                id: 100,
                content: 'Medicine',
                'className' : 'medicineClass'
            },
            {
                id: 101,
                content: 'Events',
                'className' : 'eventsClass'
            },
            {
                id: 102,
                content: 'Clinical Analysis',
                'className' : 'analysisClass'
            }
        ]
    }];
    var groups = new DataSet();
    groups.add(dataGroups[0].groups);

    // Create a DataSet (allows two way data-binding)
    var items = new DataSet();
    data.forEach(d => {
        var item = [{
            id: d.id,
            group: d.group,
            content: d.content,
            start: d.start,
            end: d.end,
            title: d.title
        }];
        items.add(item[0]);
    });

    // Configuration for the Timeline
    var options = {
        locale: 'en',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        tooltip: {
            followMouse: true,
        },
        zoomMin: 60 * 60 * 60 * 240,
        zoomMax:  100000 * 100 * 60 * 240,
        start: start,
        end: end
    };
    // Create a Timeline
    var timeline = new Timeline(container, items, groups, options);
}