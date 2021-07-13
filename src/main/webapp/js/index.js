import ReactDOM from "react-dom";
import React from "react";
import { searchMultiselect, nonSelectedText, textButtonShow, nonSelectedPatientText } from './allStrings'
import { DataSet, Timeline } from "vis-timeline/standalone";
import { Dashboard } from './initDashboard';
import { searchPatient } from './searchScript';
import { createChart, processData } from './createChart';
import { heatmap } from './heatmapChart';
var allPatients = null;
var patientSelected = null;
var geneData = null;
var selectedGenes = [];
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

$(document).ready(function () {
    //get all patients ajax function
    $.ajax({
        type: 'POST',
        url: 'PatientData',
        dataType: 'json',
        success: function (response) {
            fillPatientTable(response.Patients);
            allPatients = response.Patients;
            // create a multiple selection of patients for heatmap
            createMultiselect('selectPatientHeatmap', nonSelectedPatientText, 20);
            fillSelectPatientsHeatmap();
        }
    });

    //get all genes ajax function
    $.ajax({
        type: 'POST',
        url: 'GeneData',
        dataType: 'json',
        success: function (response) {
            geneData = response;
        }
    });

    // create a multiple selection of measurements for the graph
    createMultiselect('selectValue',nonSelectedText, 4);

    // create a multiple selection of genes for heatmap
    $('#selectValueHeatmap').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: searchMultiselect,
        nonSelectedText: nonSelectedText,
        numberDisplayed: 1,
        templates: {
            filter: '<div class="multiselect-filter d-flex align-items-center"' +
                '><i class="fas fa-sm fa-search text-muted"></i>' +
                '<input id="searchMultiselectHeatmap" type="search" class="multiselect-search form-control" placeholder="Search Here..."></div>'
        },
        onChange: function () {
            var selected = this.$select.val();
            var selectedOptions = jQuery('#selectValueHeatmap option:selected');
            var nonSelectedOptions = jQuery('#selectValueHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            selectedOptions.each(function () {
                if (!selectedGenes.includes(jQuery(this).val()))
                    selectedGenes.push(jQuery(this).val());
            });
            nonSelectedOptions.each(function () {
                if (selectedGenes.includes(jQuery(this).val())) {
                    var index = selectedGenes.indexOf(jQuery(this).val());
                    if (index > -1)
                        selectedGenes.splice(index, 1);
                }
            });
            maxValues(nonSelectedOptions);
            changeButtonApply('selectPatientHeatmap');
        },
        onFiltering: function () {
            var inputDom = document.getElementById('searchMultiselectHeatmap');
            var valueInput = inputDom.value;
            var select = document.getElementById('selectValueHeatmap');
            $('#selectValueHeatmap').empty();
            var options = [];

                geneData.Gene.forEach(d => {
                    if (valueInput.length > 2) {
                        if (d.Name.startsWith(valueInput)) {
                            options.push(d.id);
                            var opt = document.createElement('option');
                            opt.value = d.id;
                            opt.innerHTML = d.Name;
                            select.appendChild(opt);
                        }
                    } else if (selectedGenes.length > 0) {
                        if (selectedGenes.includes(d.id)) {
                            var opt = document.createElement('option');
                            opt.value = d.id;
                            opt.innerHTML = d.Name;
                            select.appendChild(opt);
                        }
                    }
                });

            ghostValueMultiselect(select);
            if (selectedGenes.length > 0) {
                $('#selectValueHeatmap').multiselect('select', selectedGenes);
            }

            var nonSelectedOptions = jQuery('#selectValueHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            maxValues(nonSelectedOptions);

            document.getElementById('searchMultiselectHeatmap').value = valueInput;
            document.getElementById('searchMultiselectHeatmap').focus();
        }
    });
        ghostValueMultiselect(document.getElementById('selectValueHeatmap'));

        $('#createHeatmap').on('click', function () {
            var selectedPatients = jQuery('#selectPatientHeatmap option:selected');
            var patientsArray = [];
            selectedPatients.each(function () {
                patientsArray.push(jQuery(this).val());
            });
            var genes = JSON.stringify(selectedGenes.sort((a,b)=>a-b));
            var patients = JSON.stringify(patientsArray.sort((a,b)=>a-b));
            $.ajax({
                type: 'POST',
                data: {"requestId" : '100', selectedGenes: genes, selectedPatients: patients},
                url: 'GeneData',
                dataType: 'json',
                success: function (response) {
                    heatmap(response.Data);
                }
            });
        });

});

function ghostValueMultiselect(domElement) {
    var select = domElement;
    var opt = document.createElement('option');
    opt.value = 'Default';
    opt.innerHTML = 'Default';
    select.appendChild(opt);

    $('#selectValueHeatmap').multiselect('rebuild');

    var button = jQuery('#selectValueHeatmap + .btn-group button[title="'+ 'Default' +'"]')
    var input = jQuery('#selectValueHeatmap + .btn-group input[value="'+ 'Default' + '"]');
    button.css('display', 'none');
    input.css('display', 'none');
}

function maxValues(nonSelectedOptions) {

    if(selectedGenes.length >= 15) {
        nonSelectedOptions.each(function () {
            var button = jQuery('#selectValueHeatmap + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#selectValueHeatmap + .btn-group input[value="'+ jQuery(this).val() + '"]');
            input.prop('disabled', true);
            button.prop('disabled', true);
            input.parent('li').addClass('disabled');
        });
    }
    else {
        jQuery('#selectValueHeatmap option').each(function () {
            var button = jQuery('#selectValueHeatmap + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#selectValueHeatmap + .btn-group input[value="' + jQuery(this).val() + '"]');
            input.prop('disabled', false);
            button.prop('disabled', false);
            input.parent('li').addClass('disabled');
        });
    }
}
function changeButtonApply(idMultiselect) {
    var selectedOptions = jQuery('#'+ idMultiselect +' option:selected');
    if (selectedGenes.length >= 5 && selectedOptions.length >= 5)
        $('#createHeatmap').attr('disabled', false);
    else
        $('#createHeatmap').attr('disabled', true);

}
function createMultiselect(id, text, maxValues) {

    $('#'+id).multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: searchMultiselect,
        nonSelectedText: text,
        numberDisplayed: 1,
        onChange: function () {
            var selected = this.$select.val();
            if (id == 'selectValue')
                processData(selected);
            else if (id == 'selectPatientHeatmap')
                changeButtonApply(id);

            var selectedOptions = jQuery('#'+ id +' option:selected');

            if(selectedOptions.length >= maxValues) {
                var nonSelectedOptions = jQuery('#'+ id +' option').filter(function () {
                    return !jQuery(this).is(':selected');
                });

                nonSelectedOptions.each(function () {
                    var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).val() +'"]')
                    var input = jQuery('#'+ id +' + .btn-group input[value="'+ jQuery(this).val() + '"]');
                    input.prop('disabled', true);
                    button.prop('disabled', true);
                    input.parent('li').addClass('disabled');
                });
            }
            else {
                jQuery('#'+ id +' option').each(function () {
                    var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).val() +'"]')
                    var input = jQuery('#'+ id +' + .btn-group input[value="' + jQuery(this).val() + '"]');
                    input.prop('disabled', false);
                    button.prop('disabled', false);
                    input.parent('li').addClass('disabled');
                });
            }
        }
    });
}
function fillSelectPatientsHeatmap() {
    $('#selectPatientHeatmap').empty();
    var select = document.getElementById('selectPatientHeatmap');
    allPatients.forEach(d => {
        var opt = document.createElement('option');
        opt.value = d.ID;
        opt.innerHTML = d.Name;
        select.appendChild(opt);
    });

    $('#selectPatientHeatmap').multiselect('rebuild');
}

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
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, $('#startDate').val(), $('#endDate').val());
        fillSelect('selectValue',patientSelected.DataPatient);
        createTimeline(patientSelected.TimelineData, $('#startDate').val(), $('#endDate').val());
        dateFilters();
    }
    function getAge(dateOfBirth) {
        var today = Date.now();
        var birth = new Date(dateOfBirth);
        return parseInt((today - birth.getTime()) / (1000*60*60*24*365));
    }
}

function dateFilters() {
    $('#startDate').removeAttr('disabled');

    $('#startDate').on('change', function () {
        var startDate = $('#startDate').val();
        $('#endDate').removeAttr('disabled');
        $('#endDate').attr('min', startDate);
        if (startDate == '') {
            $('#endDate').attr('disabled', true);
            $('#endDate').val('');
            $('#endDate').trigger('change');
        }
        else {
            if ($('#endDate').val() == '')
                $('#endDate').val(startDate);
            else $('#endDate').trigger('change');
        }
    });

    $('#endDate').on('change', function () {
        var items = $('#selectValue option:selected');
        var selected = [];
        $(items).each(function(index, items){
            selected.push([$(this).val()]);
        });
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, startDate, endDate);
        processData(selected);
        createTimeline(patientSelected.TimelineData, startDate, endDate);
    });
}

//create options for multiselect
function fillSelect(id,data) {
    $('#'+id).empty();
    var options = [];
    for (var i = 1; i < data.length; i++) {
        if(!options.includes(data[i].Measurement))
            options.push(data[i].Measurement);
    }
    var select = document.getElementById(id);
    options.forEach(d => {
        var opt = document.createElement('option');
        opt.value = d;
        opt.innerHTML = d;
        select.appendChild(opt);
    });

    $('#'+id).multiselect('rebuild');
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

function createTimeline(data, minZoomDate, maxZoomDate) {
    var today = new Date();
    var start = today.toString(), end = today.toString();
    if (minZoomDate != '' && maxZoomDate != '') {
        start = minZoomDate;
        end = maxZoomDate;
    }
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
        zoomMax:  100000 * 100 * 60 * 240,
        start: start,
        end: end
    };
    // Create a Timeline
    var timeline = new Timeline(container, items, groups, options);
}