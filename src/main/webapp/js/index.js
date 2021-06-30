import ReactDOM from "react-dom";
import React from "react";
import { searchMultiselect, nonSelectedText, textButtonShow } from './allStrings'
import { DataSet, Timeline } from "vis-timeline/standalone";
import { Dashboard } from './initDashboard';
import { searchPatient } from './searchScript';
import { createChart, processData } from './createChart';

var patientSelected = null;
//call react render for create the dahsboard
const contentDiv = document.getElementById("root");
const gridProps = window.gridProps || {};
ReactDOM.render(React.createElement(Dashboard, gridProps), contentDiv);

$('#searchPatient').keyup(searchPatient);
window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

$(document).ready(function () {
    // create a multiple selection of measurements for the graph
    $('#selectValue').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: searchMultiselect,
        nonSelectedText: nonSelectedText,
        numberDisplayed: 1,
        onChange: function () {
            var selected = this.$select.val();
            processData(selected);

            var selectedOptions = jQuery('#selectValue option:selected');

            if(selectedOptions.length >= 4) {
                var nonSelectedOptions = jQuery('#selectValue option').filter(function () {
                    return !jQuery(this).is(':selected');
                });

                nonSelectedOptions.each(function () {
                    var button = jQuery('#selectValue + .btn-group button[title="'+ jQuery(this).val() +'"]')
                    var input = jQuery('#selectValue + .btn-group input[value="'+ jQuery(this).val() + '"]');
                    input.prop('disabled', true);
                    button.prop('disabled', true);
                    input.parent('li').addClass('disabled');
                });
            }
            else {
                jQuery('#selectValue option').each(function () {
                    var button = jQuery('#selectValue + .btn-group button[title="'+ jQuery(this).val() +'"]')
                    var input = jQuery('#selectValue + .btn-group input[value="' + jQuery(this).val() + '"]');
                    input.prop('disabled', false);
                    button.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                });
            }
        }
    });
});

$("#switchChart").change(function () {
   if ($(this).is(":checked")) {
       $("#svg-main").css("display", "none");
       $("#container-1").css("display", "block");
       $("#container-2").css("display", "block");
       $("#container-3").css("display", "block");
       $("#container-4").css("display", "block");
   }
   else {
       $("#svg-main").css("display", "block");
       $("#container-1").css("display", "none");
       $("#container-2").css("display", "none");
       $("#container-3").css("display", "none");
       $("#container-4").css("display", "none");
   }
});

//get all patients ajax function
$(document).ready(function () {
    $.ajax({
        type: 'POST',
        url: 'PatientData',
        dataType: 'json',
        success: function (response) {
            fillPatientTable(response.Patients);
        }
    });
});
//fill patients table function
function fillPatientTable(data) {
    var table = null;
    for (var i=0; i<data.length;i++) {
        var dataBirth = new Date(data[i].DateOfBirth);
        var formatDate = dataBirth.getFullYear() + "-"+ (dataBirth.getMonth()+1) + "-" + dataBirth.getDate();
        table += "<tr> <td><input type='radio' name='patientRadio' id='"+data[i].ID+"'></td>"
            +"<td>"+data[i].ID+"</td>"
            +"<td>"+data[i].Name+"</td>"
            +"<td>"+data[i].Gender+"</td>"
            +"<td>"+formatDate+"</td>"
            +"<td>"+data[i].BloodType+"</td>"
            +"<td>"+data[i].Height+"cm </td>"
        +"</tr>"

    }

    $("#patientTableBody").html(table);

    $("#patientTableBody").on("change","input[type=radio]", function () {
        $.ajax({
            type: 'GET',
            url: 'PatientData',
            dataType: 'json',
            data: {"id" : this.id},
            success: function (response) {
                visitDatePatient(response);
            }
        });
    });
}
//fill visit date table function
function visitDatePatient(data) {

    //the first item of data is patient selected
    $("#patientName").html(data.Patient[0].Name);
    $("#ageSpan").html(getAge(data.Patient[0].DateOfBirth));
    $("#sexSpan").html(data.Patient[0].Gender[0].toUpperCase()+data.Patient[0].Gender.slice(1));
    $("#bloodSpan").html(data.Patient[0].BloodType);
    $("#measurementTable").empty();
    $("#tableVisitDate").empty();
    $('#noteVisit').empty();
    $("#tableVisitDate").off("click","button");
    patientSelected = data; //patient selected
    var table = null;
    if(data.DataPatient.length > 1) {
        var stringDate = [];
        var dataVisit = new Date(data.DataPatient[1].Date);
        var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
        table += "<tr><td>" + data.Patient[0].ID + "</td>"
            + "<td>" + formatDate + "</td>"
            + "<td><button type='button' class='btn btn-primary' value='"+data.DataPatient[1].Date+"'>"+ textButtonShow +"</button></td>"
            + "</tr>";

        stringDate.push(dataVisit.toString());
        for (var i = 2; i < data.DataPatient.length; i++) {
            dataVisit = new Date(data.DataPatient[i].Date);
            if (!stringDate.includes(dataVisit.toString())) {
                var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
                table += "<tr><td>" + data.Patient[0].ID + "</td>"
                    + "<td>" + formatDate + "</td>"
                    + "<td><button type='button' class='btn btn-primary' value='"+data.DataPatient[i].Date+"'>"+ textButtonShow +"</button></td>"
                    + "</tr>"
            }
            stringDate.push(dataVisit.toString());
        }

        $("#tableVisitDate").html(table);
        $("#tableVisitDate").on("click","button", function () {
            measurementTableUpdate(this.value);
        });
        //call to the funciont to create the chart
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns);
        fillSelect(patientSelected.DataPatient);
        createTimeline(patientSelected.TimelineData);
    }
    function getAge(dateOfBirth) {
        var today = Date.now();
        var birth = new Date(dateOfBirth);
        return parseInt((today - birth.getTime()) / (1000*60*60*24*365));
    }
}
//create options for select
function fillSelect(data) {
    $('#selectValue').empty();
    var options = [];
    for (var i = 1; i < data.length; i++) {
        if(!options.includes(data[i].Measurement))
            options.push(data[i].Measurement);
    }
    var select = document.getElementById('selectValue');
    options.forEach(d => {
        var opt = document.createElement('option');
        opt.value = d;
        opt.innerHTML = d;
        select.appendChild(opt);
    });

    $('#selectValue').multiselect('rebuild');
}

function measurementTableUpdate(visitDate) {

    var table, cmt = null;

    let dataSelected = [];
    if (patientSelected.DataPatient != null) {
        var date = new Date(visitDate);
        for (var i = 1; i < patientSelected.DataPatient.length; i++) {
            if (patientSelected.DataPatient[i].Date.getTime() == date.getTime()) {
                dataSelected.push(patientSelected.DataPatient[i]);
            }
        }

        for (var i = 0; i < dataSelected.length; i++) {
            var vInt = parseFloat(dataSelected[i].Value);
            var valueRounded = Math.round(vInt * 100) / 100;
            table += "<tr><td>" + dataSelected[i].Measurement + "</td>"
                + "<td>" + valueRounded + "</td>"
                + "</tr>"

        }

        $("#measurementTable").html(table);
    }

}

function createTimeline(data) {
    $('#timelineChart').empty();
    // DOM element where the Timeline will be attached
    var container = document.getElementById('timelineChart');
    //static data groups
    //id = 100 => MEDICINE
    //id = 101 => EVENTS
    var dataGroups = [{
        groups: [
            {
                id: 100,
                content: 'Medicine'
            },
            {
                id: 101,
                content: 'Events'
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
        zoomMax:  100000 * 100 * 60 * 240
    };

    // Create a Timeline
    var timeline = new Timeline(container, items, groups, options);

}