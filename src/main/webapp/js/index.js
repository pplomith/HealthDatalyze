import ReactDOM from "react-dom";
import React from "react";
import { searchMultiselect, nonSelectedText, textButtonShow, nonSelectedPatientText } from './allStrings'
import { Dashboard } from './initDashboard';
import { searchPatient, filterDatePHR } from './searchScript';
import { createChart, processData } from './createChart';
import { timelineChart } from './timelineChart';
import { heatmap } from './heatmapChart';
import { scatterplot } from './scatterPlot';

import { renderLightbox } from './lightboxImg';
import { formControl } from './HRFormControl';
var allPatients = null;
var patientSelected = null;
var geneData = null;
var scatterPlotData = null;
var selectedGenes = [];
var selectedPatients = [];
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

    $('#doctorName').html("Dr. " + $('#docName').val() + ", M.D.");
    $('#doctorId').html($('#docID').val());


    //get all patients ajax function
    $.ajax({
        type: 'POST',
        url: 'PatientData',
        dataType: 'json',
        success: function (response) {
            fillPatientTable(response.Patients);
            allPatients = response.Patients;
            // create a multiple selection of patients for heatmap
            createMultiSelectPatients();
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
    createMultiSelectGenes();

    $('#selectTypeInfo').on('change', function() {
        filterDatePHR($('#startDate').val(), $('#endDate').val());
    });

    formControl();
    newHealthRecord();

    getDataScatterPlot();
});


function createMultiSelectGenes() {

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
            var idSelect = 'selectValueHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmap';
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
            maxValues(nonSelectedOptions, idSelect, 15, selectedGenes);
            changeButtonApply();
        },
        onFiltering: function () {
            var idSelect = 'selectValueHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmap';
            var inputDom = document.getElementById(idMultiHeat);
            var valueInput = inputDom.value;
            var select = document.getElementById(idSelect);
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

            ghostValueMultiselect(select, idSelect);
            if (selectedGenes.length > 0) {
                $('#selectValueHeatmap').multiselect('select', selectedGenes);
            }

            var nonSelectedOptions = jQuery('#selectValueHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            maxValues(nonSelectedOptions, idSelect, 15, selectedGenes);

            document.getElementById(idMultiHeat).value = valueInput;
            document.getElementById(idMultiHeat).focus();
        }
    });
    ghostValueMultiselect(document.getElementById('selectValueHeatmap'), 'selectValueHeatmap');

    $('#createHeatmap').on('click', function () {
        var genes = JSON.stringify(selectedGenes.sort((a,b)=>a-b));
        var patients = JSON.stringify(selectedPatients.sort((a,b)=>a-b));
        $.ajax({
            type: 'POST',
            data: {"requestId" : '100', selectedGenes: genes, selectedPatients: patients},
            url: 'GeneData',
            dataType: 'json',
            success: function (response) {
                heatmap(response.Data);
                const config = {
                    childList: true
                };
                const callback = function (mutationList, observer) {
                    document.getElementById('heatmapChart')
                        .getElementsByTagName('svg')[0]
                        .setAttribute('preserveAspectRatio','none');
                }
                var mutationObserver = new MutationObserver(callback);
                mutationObserver.observe(document.getElementById('heatmapChart'), config);
            }
        });
    });

}

function createMultiSelectPatients() {

    $('#selectPatientHeatmap').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: searchMultiselect,
        nonSelectedText: nonSelectedPatientText,
        numberDisplayed: 1,
        templates: {
            filter: '<div class="multiselect-filter d-flex align-items-center"' +
                '><i class="fas fa-sm fa-search text-muted"></i>' +
                '<input id="searchMultiselectHeatmapPatient" type="search" class="multiselect-search form-control" placeholder="Search Here..."></div>'
        },
        onChange: function () {
            var selected = this.$select.val();
            var selectedOptions = jQuery('#selectPatientHeatmap option:selected');
            var idSelect = 'selectPatientHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmapPatient';
            var nonSelectedOptions = jQuery('#selectPatientHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            selectedOptions.each(function () {
                if (!selectedPatients.includes(jQuery(this).val()))
                    selectedPatients.push(jQuery(this).val());
            });
            nonSelectedOptions.each(function () {
                if (selectedPatients.includes(jQuery(this).val())) {
                    var index = selectedPatients.indexOf(jQuery(this).val());
                    if (index > -1)
                        selectedPatients.splice(index, 1);
                }
            });
            maxValues(nonSelectedOptions, idSelect, 20, selectedPatients);
            changeButtonApply();
        },
        onFiltering: function () {
            var idSelect = 'selectPatientHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmapPatient';
            var inputDom = document.getElementById(idMultiHeat);
            var valueInput = inputDom.value;
            var select = document.getElementById(idSelect);
            $('#selectPatientHeatmap').empty();
            var options = [];

            allPatients.forEach(d => {
                if (valueInput.length > 2) {
                    if (d.Name.toUpperCase().startsWith(valueInput.toUpperCase())) {
                        options.push(d.ID);
                        var opt = document.createElement('option');
                        opt.value = d.ID;
                        opt.innerHTML = d.Name;
                        select.appendChild(opt);
                    }
                } else if (selectedPatients.length > 0) {
                    if (selectedPatients.includes(d.ID)) {
                        var opt = document.createElement('option');
                        opt.value = d.ID;
                        opt.innerHTML = d.Name;
                        select.appendChild(opt);
                    }
                }
            });

            ghostValueMultiselect(select, idSelect);
            if (selectedPatients.length > 0) {
                $('#selectPatientHeatmap').multiselect('select', selectedPatients);
            }

            var nonSelectedOptions = jQuery('#selectPatientHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            maxValues(nonSelectedOptions, idSelect, 20, selectedPatients);

            document.getElementById(idMultiHeat).value = valueInput;
            document.getElementById(idMultiHeat).focus();
        }
    });
    ghostValueMultiselect(document.getElementById('selectPatientHeatmap'), 'selectPatientHeatmap');

}


function ghostValueMultiselect(domElement, id) {
    var select = domElement;
    var opt = document.createElement('option');
    opt.value = 'Default';
    opt.innerHTML = 'Default';
    select.appendChild(opt);

    $('#'+id).multiselect('rebuild');

    var button = jQuery('#' + id + ' + .btn-group button[title="'+ 'Default' +'"]')
    var input = jQuery('#' + id +  ' + .btn-group input[value="'+ 'Default' + '"]');
    button.css('display', 'none');
    input.css('display', 'none');
}

function maxValues(nonSelectedOptions, id, value, data) {

    if(data.length >= value) {
        nonSelectedOptions.each(function () {
            var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#'+ id +' + .btn-group input[value="'+ jQuery(this).val() + '"]');
            input.prop('disabled', true);
            button.prop('disabled', true);
            input.parent('li').addClass('disabled');
        });
    }
    else {
        jQuery('#' + id + ' option').each(function () {
            var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#'+ id +' + .btn-group input[value="' + jQuery(this).val() + '"]');
            input.prop('disabled', false);
            button.prop('disabled', false);
            input.parent('li').addClass('disabled');
        });
    }
}
function changeButtonApply() {
    if (selectedGenes.length >= 5 && selectedPatients.length >= 5)
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

//fills the table of all patients
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
                tablePHR(response);
            }
        });
    });
}
//fill in the table with the appointments made by the patient
function tablePHR(data) {
    //the first item of data is patient selected
    selectedPatients.push(data.Patient[0].ID);
    var options = [
        {label: data.Patient[0].Name, title: data.Patient[0].Name, value: data.Patient[0].ID, selected: true}
    ];
    $('#selectPatientHeatmap').multiselect('dataprovider', options);
    $("#patientAvatar").empty();
    $("#patientAvatar").append('<img src="images/patients/'+data.Patient[0].ID+'.jpg" id="patientImage" />');
    $("#patientName").html(data.Patient[0].Name);
    $("#ageSpan").html(getAge(data.Patient[0].DateOfBirth));
    $("#sexSpan").html(data.Patient[0].Gender[0].toUpperCase()+data.Patient[0].Gender.slice(1));
    $("#bloodSpan").html(data.Patient[0].BloodType);
    $("#measurementTable").empty();
    $("#tableVisitDate").empty();
    $('#noteVisit').empty();
    $("#tableVisitDate").off("click","button");
    $('#add-healthRecord').removeAttr('disabled');
    patientSelected = data; //patient selected

    if(data.DataPatient.length > 1 || data.TimelineData.length > 1) {
        fillTablePHR(data);
        filterDatePHR($('#startDate').val(), $('#endDate').val());
        $("#tableVisitDate").on("click","button", function () {
            tableInformationAnalysis(this.value);
        });
        list_Diseases_Medicines(patientSelected.TimelineData);
        //call to the funciont to create the chart
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, $('#startDate').val(), $('#endDate').val());
        fillSelect('selectValue',patientSelected.DataPatient);
        timelineChart(patientSelected.TimelineData, $('#startDate').val(), $('#endDate').val());
        dateFilters();
        createScatterPlot();
    }
    function getAge(dateOfBirth) {
        var today = Date.now();
        var birth = new Date(dateOfBirth);
        return parseInt((today - birth.getTime()) / (1000*60*60*24*365));
    }
}

function fillTablePHR(data) {
    var table = null;
    var stringDate = [];
    var dateObject = [];
    for (var i = 1; i < data.DataPatient.length; i++) {
        var dataVisit = new Date(data.DataPatient[i].Date);
        if (!stringDate.includes(dataVisit.toString())) {
            var obj = {
                'id' : data.Patient[0].ID,
                'startDate': dataVisit,
                'endDate' : '/',
                'type' : 'clinical analysis',
                'btnValue' : data.DataPatient[i].Date
            };
            dateObject.push(obj);
            stringDate.push(dataVisit.toString());
        }
    }
    var analysisId = '102'; //exclude clinical analysis group
    var nowDate = new Date();
    stringDate = [];
    for (var i = 0; i < data.TimelineData.length; i++) {
        if (data.TimelineData[i].group != analysisId) {
            var startDate = new Date(data.TimelineData[i].start);
            if (!stringDate.includes(startDate.toString())) {
                var obj = {
                    'id' : data.Patient[0].ID,
                    'startDate': startDate,
                    'endDate' : data.TimelineData[i].end != null ? new Date(data.TimelineData[i].end) : '/',
                    'type' : data.TimelineData[i].type,
                    'btnValue' : data.TimelineData[i].start
                };
                dateObject.push(obj);
                stringDate.push(startDate.toString());
            }
        }
    }
    dateObject.sort(function (a,b) {
        var bDate = b.endDate;
        var aDate = a.endDate;
        if (b.endDate == '/') bDate = b.startDate;
        if (a.endDate == '/') aDate = a.startDate;
        return new Date(bDate) - new Date(aDate)
    });
    for (var i = 0; i < dateObject.length; i++) {
        var formatStartDate = dateObject[i].startDate.getFullYear()
            + "-" + (dateObject[i].startDate.getMonth() + 1)
            + "-" + dateObject[i].startDate.getDate() + " " +
            dateObject[i].startDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        var formatEndDate;
        if (dateObject[i].endDate != '/')
            formatEndDate = dateObject[i].endDate.getFullYear()
                + "-" + (dateObject[i].endDate.getMonth() + 1)
                + "-" + dateObject[i].endDate.getDate() + " " +
                dateObject[i].endDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        else
            formatEndDate = '/';
        var btnValue = (dateObject[i].type == 'clinical analysis') ? 'PHR'+dateObject[i].btnValue : dateObject[i].btnValue;

        table += "<tr><td>" + dateObject[i].id + "</td>"
            + "<td>" + formatStartDate + "</td>"
            + "<td>" + formatEndDate + "</td>"
            + "<td>" + dateObject[i].type + "</td>"
            + "<td>" +
            "<button type='button' class='btn btn-primary' value='"+ btnValue +"'>"+ textButtonShow +"</button>" +
            "</td>"
            + "</tr>"
    }

    $("#tableVisitDate").html(table);
}

function dateFilters() {
    $('#startDate').removeAttr('disabled');
    $('#endDate').removeAttr('disabled');

    $('#startDate').on('change', function () {
        var startDate = $('#startDate').val();
        $('#endDate').attr('min', startDate);
        var endDate = $('#endDate').val();
        checkDate(startDate, endDate);
    });

    $('#endDate').on('change', function () {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        checkDate(startDate, endDate);
    });

    $('#btnFilterDate').on('click', function () {
        var items = $('#selectValue option:selected');
        var selected = [];
        $(items).each(function(index, items){
            selected.push([$(this).val()]);
        });
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, startDate, endDate);
        processData(selected);
        timelineChart(patientSelected.TimelineData, startDate, endDate);
        filterDatePHR(startDate, endDate);
    });
}
function checkDate(startDate, endDate) {
    if (startDate != '' && endDate != ''){
        if (new Date(startDate).getTime() <= new Date(endDate).getTime())
            $('#btnFilterDate').removeAttr('disabled');
        else
            $('#btnFilterDate').attr('disabled', true);
    } else if (startDate != '' || endDate != '')
        $('#btnFilterDate').removeAttr('disabled');
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

function tableInformationAnalysis(analysisDate) {

    var table, cmt = null;

    let dataSelected = [];
    if (patientSelected.DataPatient != null) {
        if (analysisDate.startsWith('PHR')) {
            var date = new Date(analysisDate.substring(3));

            for (var i = 1; i < patientSelected.DataPatient.length; i++) {
                if (patientSelected.DataPatient[i].Date.getTime() == date.getTime()) {
                    dataSelected.push(patientSelected.DataPatient[i]);
                }
            }
            //analisys information (DataPatient)
            for (var i = 0; i < dataSelected.length; i++) {
                var vInt = parseFloat(dataSelected[i].Value);
                var valueRounded = Math.round(vInt * 100) / 100;
                table += "<tr><td>" + dataSelected[i].Measurement + "</td>"
                    + "<td>" + 'Value: ' + valueRounded + "</td>"
                    + "</tr>"
            }
        } else {
            var date = new Date(analysisDate);
            dataSelected = [];
            for (var i = 0; i < patientSelected.TimelineData.length; i++) {
                var startDate = new Date(patientSelected.TimelineData[i].start);
                if (startDate.getTime() == date.getTime() && patientSelected.TimelineData[i].group != '102') {
                    dataSelected.push(patientSelected.TimelineData[i]);
                }
            }
            var radiologyImg = [];
            for (var i = 0; i < dataSelected.length; i++) {
                table += "<tr><td>" + dataSelected[i].content + "</td>"
                    + "<td>" + dataSelected[i].title + "</td>"
                    + "</tr>"
                if (dataSelected[i].type == 'diagnostic radiology') {
                    var idDiv = "lightbox-img"+i;
                    table += "<tr><td colSpan='2'> "
                        + "<div id ='"+ idDiv +"'></div>" +
                        "</td>"
                        + "</tr>";
                    var obj = {
                        "pathImg" : dataSelected[i].pathImg,
                        "id"  : idDiv
                    };
                    radiologyImg.push(obj);
                }
            }
        }

        $("#measurementTable").html(table);
        for (var i = 0; i < radiologyImg.length; i++) {
            var img = [];
            for (var j = 0; j < radiologyImg[i].pathImg.length; j++) {
                img.push("images/" + radiologyImg[i].pathImg[j]);
            }
            renderLightbox(img, radiologyImg[i].id);
        }

    }

}

function list_Diseases_Medicines(data) {
    $("#list-diseases").empty();
    $("#list-medicines").empty();
    var ulDiseases = document.getElementById('list-diseases');
    var ulMedicines = document.getElementById('list-medicines');
    var now = new Date();
    for(var i = 0; i < data.length; i++) {
        var node = document.createElement('li');
        node.classList.add('listInfoPatient', 'list-group-item');
        var h6 = document.createElement('h6');
        h6.classList.add('heading-itemInfo');
        var small = document.createElement('small');
        if (data[i].end == null && new Date(data[i].start).getTime() <= now.getTime()) {
            if (data[i].type == 'disease') {
                var startDate = new Date(data[i].start);
                var formatDate = startDate.getFullYear()
                    + "-" + (startDate.getMonth() + 1)
                    + "-" + startDate.getDate() + " " +
                    startDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                h6.innerHTML = data[i].content;
                small.innerHTML = 'Diagnosed: ' + formatDate;
                node.appendChild(h6);
                node.appendChild(small);
                ulDiseases.appendChild(node);
            }
        } else if (new Date(data[i].end).getTime() >= now.getTime() && new Date(data[i].start).getTime() <= now.getTime()) {
            if (data[i].type == 'medicine') {
                 var startDate = new Date(data[i].start);
                 var formatDate = startDate.getFullYear()
                     + "-" + (startDate.getMonth() + 1)
                     + "-" + startDate.getDate() + " " +
                     startDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });;
                 var endDate = new Date(data[i].end);
                 var formatEndDate = endDate.getFullYear()
                     + "-" + (endDate.getMonth() + 1)
                     + "-" + endDate.getDate() + " " +
                     endDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });;
                h6.innerHTML = data[i].content;
                small.innerHTML = 'from: ' + formatDate + ' to: ' + formatEndDate;
                node.appendChild(h6);
                node.appendChild(small);
                ulMedicines.appendChild(node);
            }
        }
    }

}

function newHealthRecord() {
    $('#saveHealthRecord').on('click', function () {
        var local = getTimeZone();
        var sDate = $('#startDateHR').val()+':00.000'+local;
        var eDate = ($('#endDateHR').val() != '') ? $('#endDateHR').val()+':00.000'+local : null;
        var nameHR = $('#nameHealthRecord').val();
        var descrHR = $('#descriptionRecord').val();
        var typeHR = $('#selectTypeHealthRecord').val();
        var groupId;
        if (typeHR == 'medicine') groupId = '100';
        else if (typeHR == 'disease' || typeHR == 'surgery') groupId = '101';
        $.ajax({
            type: 'POST',
            url: 'PatientData',
            dataType: 'json',
            data: {"id" : patientSelected.Patient[0].ID, "requestId" : '105', "startDate" : sDate, "endDate" : eDate,
            "name" : nameHR, "type" : typeHR, "description" : descrHR, "groupId" : groupId},
            success: function (response) {
                patientSelected.TimelineData = response.TimelineData;
                $("#measurementTable").empty();

                fillTablePHR(patientSelected);

                filterDatePHR($('#startDate').val(), $('#endDate').val());

                $("#tableVisitDate").on("click","button", function () {
                    tableInformationAnalysis(this.value);
                });

                list_Diseases_Medicines(patientSelected.TimelineData);

                timelineChart(patientSelected.TimelineData, $('#startDate').val(), $('#endDate').val());
            }
        });
    });

    function getTimeZone() {
        var offset = new Date().getTimezoneOffset(),
            o = Math.abs(offset);
        return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
    }
}

function getDataScatterPlot() {

    $.ajax({
        type: 'POST',
        data: {"requestId" : '201'},
        url: 'GeneData',
        dataType: 'json',
        success: function (response) {
            if (response != "Server Error") {
                scatterPlotData = response.Data;
                createScatterPlot();
            }
        }
    });
    $('#selectCategorySP').on('change', function() {
        createScatterPlot();
    });
}
function createScatterPlot() {
    if (patientSelected != null) {
        scatterplot(scatterPlotData, $('#selectCategorySP').val(), patientSelected.Patient[0].ID);
    } else {
        scatterplot(scatterPlotData, $('#selectCategorySP').val(), null);
    }
    const config = {
        childList: true
    };
    const callback = function (mutationList, observer) {
        document.getElementById('scatterPlot')
            .getElementsByTagName('svg')[0]
            .setAttribute('preserveAspectRatio','none');
    }
    var mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.getElementById('scatterPlotChart'), config);
}
