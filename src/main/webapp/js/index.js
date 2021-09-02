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
var allPatients = null; //json object to store all patients
var patientSelected = null; //json object to store the selected patient
var geneData = null; //json object to store all information about the genes
var scatterPlotData = null; //json object to store the data for scatter chart
var selectedGenes = []; //array to store selected genes
var selectedPatients = []; //array to store selected patients
//call react render for create the dahsboard
const contentDiv = document.getElementById("root");
const gridProps = window.gridProps || {};
ReactDOM.render(React.createElement(Dashboard, gridProps), contentDiv);

//function call to filter patients in the search
$('#searchPatient').keyup(searchPatient);
//add event listener to button to hide sidebar
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
//toggle button for line chart
//switch from single chart to multiple charts or viceversa
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
    //setting the doctor name and id in sidebar
    $('#doctorName').html("Dr. " + $('#docName').val() + ", M.D.");
    $('#doctorId').html($('#docID').val());


    //get all patients with ajax function
    $.ajax({
        type: 'POST',
        url: 'PatientData',
        dataType: 'json',
        success: function (response) {
            //fill in the table with patient information
            fillPatientTable(response.Patients);
            allPatients = response.Patients;
            // create a multiple selection of patients for heatmap
            createMultiSelectPatients();
        }
    });

    //get all genes with ajax function
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

    //event listener to change the filter type
    $('#selectTypeInfo').on('change', function() {
        filterDatePHR($('#startDate').val(), $('#endDate').val());
    });
    //function for new health record
    formControl();
    newHealthRecord();
    //function to get scatter plot data
    getDataScatterPlot();
});
//creation of multiselect for gene selection
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
            var selectedOptions = jQuery('#selectValueHeatmap option:selected'); //obtaining all selected values
            var idSelect = 'selectValueHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmap';
            var nonSelectedOptions = jQuery('#selectValueHeatmap option').filter(function () {
                return !jQuery(this).is(':selected'); //getting all unselected values
            });
            selectedOptions.each(function () {
                if (!selectedGenes.includes(jQuery(this).val()))
                    selectedGenes.push(jQuery(this).val()); //storage in the array of all selected genes
            });
            nonSelectedOptions.each(function () {
                if (selectedGenes.includes(jQuery(this).val())) {
                    var index = selectedGenes.indexOf(jQuery(this).val());
                    if (index > -1)
                        selectedGenes.splice(index, 1); //delete an item that has been deselected
                }
            });
            //setting the maximum selection values
            maxValues(nonSelectedOptions, idSelect, 15, selectedGenes);
            changeButtonApply();
        },
        onFiltering: function () {
            var idSelect = 'selectValueHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmap';
            var inputDom = document.getElementById(idMultiHeat); //obtaining the value of the search input
            var valueInput = inputDom.value;
            var select = document.getElementById(idSelect);
            $('#selectValueHeatmap').empty();
            var options = [];
            //creation of options with selected genes
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
            //hidden option to show the search bar
            ghostValueMultiselect(select, idSelect);
            if (selectedGenes.length > 0) {
                $('#selectValueHeatmap').multiselect('select', selectedGenes);
            }

            var nonSelectedOptions = jQuery('#selectValueHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            //setting the maximum selection values
            maxValues(nonSelectedOptions, idSelect, 15, selectedGenes);

            document.getElementById(idMultiHeat).value = valueInput;
            document.getElementById(idMultiHeat).focus();
        }
    });
    //hidden option to show the search bar
    ghostValueMultiselect(document.getElementById('selectValueHeatmap'), 'selectValueHeatmap');
    //ajax function to get all the data on which to build the heatmap
    $('#createHeatmap').on('click', function () {
        var genes = JSON.stringify(selectedGenes.sort((a,b)=>a-b)); //json object (genes) formatting in string
        var patients = JSON.stringify(selectedPatients.sort((a,b)=>a-b)); //json object (patients) formatting in string
        $.ajax({
            type: 'POST',
            data: {"requestId" : '100', selectedGenes: genes, selectedPatients: patients},
            url: 'GeneData',
            dataType: 'json',
            success: function (response) {
                //function to create the heat map
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
                //mutation observer to set parameters once the graph is created
                mutationObserver.observe(document.getElementById('heatmapChart'), config);
            }
        });
    });

}
//creation of multiselect for patient selection
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
            var selectedOptions = jQuery('#selectPatientHeatmap option:selected'); //obtaining all selected values
            var idSelect = 'selectPatientHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmapPatient';
            var nonSelectedOptions = jQuery('#selectPatientHeatmap option').filter(function () {
                return !jQuery(this).is(':selected'); //getting all unselected values
            });
            selectedOptions.each(function () {
                if (!selectedPatients.includes(jQuery(this).val()))
                    selectedPatients.push(jQuery(this).val()); //storage in the array of all selected patients
            });
            nonSelectedOptions.each(function () {
                if (selectedPatients.includes(jQuery(this).val())) {
                    var index = selectedPatients.indexOf(jQuery(this).val());
                    if (index > -1)
                        selectedPatients.splice(index, 1); //delete an item that has been deselected
                }
            });
            //setting the maximum selection values
            maxValues(nonSelectedOptions, idSelect, 20, selectedPatients);
            changeButtonApply();
        },
        onFiltering: function () {
            var idSelect = 'selectPatientHeatmap';
            var idMultiHeat = 'searchMultiselectHeatmapPatient';
            var inputDom = document.getElementById(idMultiHeat); //obtaining the value of the search input
            var valueInput = inputDom.value;
            var select = document.getElementById(idSelect);
            $('#selectPatientHeatmap').empty();
            var options = [];
            //creation of options with selected patients
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
            //hidden option to show the search bar
            ghostValueMultiselect(select, idSelect);
            if (selectedPatients.length > 0) {
                $('#selectPatientHeatmap').multiselect('select', selectedPatients);
            }

            var nonSelectedOptions = jQuery('#selectPatientHeatmap option').filter(function () {
                return !jQuery(this).is(':selected');
            });
            //setting the maximum selection values
            maxValues(nonSelectedOptions, idSelect, 20, selectedPatients);

            document.getElementById(idMultiHeat).value = valueInput;
            document.getElementById(idMultiHeat).focus();
        }
    });
    ghostValueMultiselect(document.getElementById('selectPatientHeatmap'), 'selectPatientHeatmap');

}
//function to create a hidden option to show the search bar
function ghostValueMultiselect(domElement, id) {
    var select = domElement;
    var opt = document.createElement('option');
    opt.value = 'Default';
    opt.innerHTML = 'Default';
    select.appendChild(opt);

    $('#'+id).multiselect('rebuild'); //rebuild the multiselect

    var button = jQuery('#' + id + ' + .btn-group button[title="'+ 'Default' +'"]')
    var input = jQuery('#' + id +  ' + .btn-group input[value="'+ 'Default' + '"]');
    button.css('display', 'none');
    input.css('display', 'none');
}
//function to set a maximum value of selectable items
function maxValues(nonSelectedOptions, id, value, data) {

    if(data.length >= value) { //if the number of selected items is greater than the maximum value, the other items are made unselectable
        nonSelectedOptions.each(function () { //getting all unselected values
            var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#'+ id +' + .btn-group input[value="'+ jQuery(this).val() + '"]');
            input.prop('disabled', true);
            button.prop('disabled', true); //disable button to select them
            input.parent('li').addClass('disabled');
        });
    }
    else { //otherwise all selectable
        jQuery('#' + id + ' option').each(function () {
            var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).text() +'"]')
            var input = jQuery('#'+ id +' + .btn-group input[value="' + jQuery(this).val() + '"]');
            input.prop('disabled', false);
            button.prop('disabled', false);
            input.parent('li').addClass('disabled');
        });
    }
}
//function to enable or disable the button for creating the heatmap
function changeButtonApply() {
    if (selectedGenes.length >= 5 && selectedPatients.length >= 5)
        $('#createHeatmap').attr('disabled', false);
    else
        $('#createHeatmap').attr('disabled', true);

}
//creation of multiselection for the selection of measurements of interest
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

            var selectedOptions = jQuery('#'+ id +' option:selected'); //obtaining all selected values

            if(selectedOptions.length >= maxValues) { //if the number of selected items is greater than the maximum value, the other items are made unselectable
                var nonSelectedOptions = jQuery('#'+ id +' option').filter(function () {
                    return !jQuery(this).is(':selected'); //getting all unselected values
                });

                nonSelectedOptions.each(function () {
                    var button = jQuery('#'+ id +' + .btn-group button[title="'+ jQuery(this).val() +'"]')
                    var input = jQuery('#'+ id +' + .btn-group input[value="'+ jQuery(this).val() + '"]');
                    input.prop('disabled', true);
                    button.prop('disabled', true); //disable button to select them
                    input.parent('li').addClass('disabled');
                });
            }
            else { //otherwise all selectable
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
    //ajax function to obtain all the data of the patient just selected
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
    //patient personal information settings
    $("#patientAvatar").empty();
    $("#patientAvatar").append('<img src="images/patients/'+data.Patient[0].ID+'.jpg" id="patientImage" />');
    $("#patientName").html(data.Patient[0].Name);
    $("#ageSpan").html(getAge(data.Patient[0].DateOfBirth));
    $("#sexSpan").html(data.Patient[0].Gender[0].toUpperCase()+data.Patient[0].Gender.slice(1));
    $("#bloodSpan").html(data.Patient[0].BloodType);
    //elimination of elements in previously created tables
    $("#measurementTable").empty();
    $("#tableVisitDate").empty();
    $('#noteVisit').empty();
    $("#tableVisitDate").off("click","button");
    $('#add-healthRecord').removeAttr('disabled');
    patientSelected = data; //selected patient
    if(data.DataPatient.length > 1 || data.TimelineData.length > 1) {
        fillTablePHR(data); //filling table to view all clinical information
        filterDatePHR($('#startDate').val(), $('#endDate').val()); //filter application on dates
        $("#tableVisitDate").on("click","button", function () {
            tableInformationAnalysis(this.value);
        });
        //modification of the patient's list of medicines and current illnesses
        list_Diseases_Medicines(patientSelected.TimelineData);
        //call to the funciont to create the chart
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, $('#startDate').val(), $('#endDate').val());
        //select fill for the measurements of interest
        fillSelect('selectValue',patientSelected.DataPatient);
        //construction of timeline with the data of the selected patient
        timelineChart(patientSelected.TimelineData, $('#startDate').val(), $('#endDate').val());
        dateFilters();
        //creation of the scatter plot with the selected patient
        createScatterPlot();
    }
    //get the age from the date of birth and show it
    function getAge(dateOfBirth) {
        var today = Date.now();
        var birth = new Date(dateOfBirth);
        return parseInt((today - birth.getTime()) / (1000*60*60*24*365));
    }
}
//function to fill the table with the clinical history of the selected patient
function fillTablePHR(data) {
    var table = null;
    var stringDate = []; //array to store a single date of a record with multiple measurements
    var dateObject = []; //array with the elements to show
    //for on patient analysis
    for (var i = 1; i < data.DataPatient.length; i++) {
        var dataVisit = new Date(data.DataPatient[i].Date);
        //check if the date is not already present in the array, in order not to create duplicates
        if (!stringDate.includes(dataVisit.toString())) {
            //creation of the json object with the same fields useful for the timeline
            var obj = {
                'id' : data.Patient[0].ID,
                'startDate': dataVisit,
                'endDate' : '/',
                'type' : 'clinical analysis',
                'btnValue' : data.DataPatient[i].Date
            };
            dateObject.push(obj);
            //inserting the new date into the array
            stringDate.push(dataVisit.toString());
        }
    }
    var analysisId = '102'; //exclude clinical analysis group
    var nowDate = new Date();
    stringDate = []; //reset the array for new events
    //for on the other clinical events of the patient (without analysis)
    for (var i = 0; i < data.TimelineData.length; i++) {
        //check if it is not a clinical analysis (group id)
        if (data.TimelineData[i].group != analysisId) {
            var startDate = new Date(data.TimelineData[i].start);
            //check if the date is not already present in the array, in order not to create duplicates
            if (!stringDate.includes(startDate.toString())) {
                //creation of the json object with the same fields useful for the timeline
                var obj = {
                    'id' : data.Patient[0].ID,
                    'startDate': startDate,
                    'endDate' : data.TimelineData[i].end != null ? new Date(data.TimelineData[i].end) : '/',
                    'type' : data.TimelineData[i].type,
                    'btnValue' : data.TimelineData[i].start
                };
                dateObject.push(obj);
                //inserting the new date into the array
                stringDate.push(startDate.toString());
            }
        }
    }
    //sort the objects according to the end date,
    //in case it is not present the start date is temporarily used
    dateObject.sort(function (a,b) {
        var bDate = b.endDate;
        var aDate = a.endDate;
        if (b.endDate == '/') bDate = b.startDate;
        if (a.endDate == '/') aDate = a.startDate;
        return new Date(bDate) - new Date(aDate)
    });
    //field formatting
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
        //creation of a table row for each record
        table += "<tr><td>" + dateObject[i].id + "</td>"
            + "<td>" + formatStartDate + "</td>"
            + "<td>" + formatEndDate + "</td>"
            + "<td>" + dateObject[i].type + "</td>"
            + "<td>" +
            "<button type='button' class='btn btn-primary' value='"+ btnValue +"'>"+ textButtonShow +"</button>" +
            "</td>"
            + "</tr>"
    }
    //display table
    $("#tableVisitDate").html(table);
}
//function to manage the filter on dates
function dateFilters() {
    $('#startDate').removeAttr('disabled');
    $('#endDate').removeAttr('disabled');
    //event listener when the start date entry changes
    $('#startDate').on('change', function () {
        var startDate = $('#startDate').val();
        $('#endDate').attr('min', startDate); //minimum value of the end date set to the start date
        var endDate = $('#endDate').val();
        checkDate(startDate, endDate);
    });
    //event listener when the end date entry changes
    $('#endDate').on('change', function () {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        //check if the set dates are correct
        checkDate(startDate, endDate);
    });
    //function invoked when the button is clicked to apply the filter
    $('#btnFilterDate').on('click', function () {
        var items = $('#selectValue option:selected');
        var selected = [];
        $(items).each(function(index, items){
            selected.push([$(this).val()]);
        });
        var startDate = $('#startDate').val(); //get the start date
        var endDate = $('#endDate').val(); //get the end date
        //update of the chart on vital data
        createChart(patientSelected.DataPatient, patientSelected.VitalSigns, startDate, endDate);
        //update of the graph on the measurements of interest
        processData(selected);
        //update timeline chart
        timelineChart(patientSelected.TimelineData, startDate, endDate);
        //update of the table showing the medical history
        filterDatePHR(startDate, endDate);
    });
}
//function to check if the set dates are correct
function checkDate(startDate, endDate) {
    if (startDate != '' && endDate != ''){
        if (new Date(startDate).getTime() <= new Date(endDate).getTime()) //check if the end date is later than the start date
            $('#btnFilterDate').removeAttr('disabled');
        else
            $('#btnFilterDate').attr('disabled', true);
    } else if (startDate != '' || endDate != '')
        $('#btnFilterDate').removeAttr('disabled');
}
//creation of options for the multiselect of the measurements of interest
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
//function to create the table with the details of clinical events
function tableInformationAnalysis(analysisDate) {
    var table, cmt = null;
    let dataSelected = [];
    if (patientSelected.DataPatient != null) {
        if (analysisDate.startsWith('PHR')) { //check if it is a clinical analysis
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
                //creation of table row for clinical analysis
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
            var radiologyImg = []; //array to store the radiology results paths
            for (var i = 0; i < dataSelected.length; i++) {
                //creation of table row for other events
                table += "<tr><td>" + dataSelected[i].content + "</td>"
                    + "<td>" + dataSelected[i].title + "</td>"
                    + "</tr>"
                if (dataSelected[i].type == 'diagnostic radiology') {
                    //if it is a radiology, a row is added for the button
                    var idDiv = "lightbox-img"+i;
                    table += "<tr><td colSpan='2'> "
                        + "<div id ='"+ idDiv +"'></div>" +
                        "</td>"
                        + "</tr>";
                    //creating the json object for the results
                    var obj = {
                        "pathImg" : dataSelected[i].pathImg,
                        "id"  : idDiv
                    };
                    radiologyImg.push(obj);
                }
            }
        }
        //display table
        $("#measurementTable").html(table);
        for (var i = 0; i < radiologyImg.length; i++) {
            var img = [];
            //creation of the path for the images
            for (var j = 0; j < radiologyImg[i].pathImg.length; j++) {
                img.push("images/" + radiologyImg[i].pathImg[j]);
            }
            //building the component to view the results
            renderLightbox(img, radiologyImg[i].id);
        }
    }
}
//function to create a list of medicines and diseases in the patient information
function list_Diseases_Medicines(data) {
    $("#list-diseases").empty();
    $("#list-medicines").empty();
    var ulDiseases = document.getElementById('list-diseases'); //diseases list
    var ulMedicines = document.getElementById('list-medicines'); //medicines list
    var now = new Date(); //get current date
    for(var i = 0; i < data.length; i++) {
        var node = document.createElement('li'); //new list item
        node.classList.add('listInfoPatient', 'list-group-item');
        var h6 = document.createElement('h6'); //element to show the name
        h6.classList.add('heading-itemInfo');
        var small = document.createElement('small'); //element to show dates
        if (data[i].end == null && new Date(data[i].start).getTime() <= now.getTime()) {
            if (data[i].type == 'disease') {
                //addition of the disease in progress, by formatting the fields to be displayed
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
                //adding the medicine the patient is taking, by formatting the fields to be displayed
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
//function to create a new clinical event
function newHealthRecord() {
    //invocation of the function when the record is to be created
    $('#saveHealthRecord').on('click', function () {
        var local = getTimeZone();
        //date formatting
        var sDate = $('#startDateHR').val()+':00.000'+local;
        var eDate = ($('#endDateHR').val() != '') ? $('#endDateHR').val()+':00.000'+local : null;
        var nameHR = $('#nameHealthRecord').val(); //get name
        var descrHR = $('#descriptionRecord').val(); //get description
        var typeHR = $('#selectTypeHealthRecord').val(); //get type
        var groupId;
        //set group id
        if (typeHR == 'medicine') groupId = '100';
        else if (typeHR == 'disease' || typeHR == 'surgery') groupId = '101';
        //ajax function to insert the item into the database
        $.ajax({
            type: 'POST',
            url: 'PatientData',
            dataType: 'json',
            data: {"id" : patientSelected.Patient[0].ID, "requestId" : '105', "startDate" : sDate, "endDate" : eDate,
            "name" : nameHR, "type" : typeHR, "description" : descrHR, "groupId" : groupId},
            success: function (response) {
                //insertion occurred
                //update all graphs to view the new element created
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
//function to get all the data for the scatter plot
function getDataScatterPlot() {
    $.ajax({
        type: 'POST',
        data: {"requestId" : '201'},
        url: 'GeneData',
        dataType: 'json',
        success: function (response) {
            if (response != "Server Error") {
                scatterPlotData = response.Data;
                //creation of the scatter plot
                createScatterPlot();
            }
        }
    });
    //event listener to create the chart when the category is changed
    $('#selectCategorySP').on('change', function() {
        createScatterPlot();
    });
}
//function for creating the scatter plot
function createScatterPlot() {
    if (patientSelected != null) { //check if a patient has been selected
        //the patient is passed to the function
        scatterplot(scatterPlotData, $('#selectCategorySP').val(), patientSelected.Patient[0].ID);
    } else {
        //otherwise, patient = null
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
