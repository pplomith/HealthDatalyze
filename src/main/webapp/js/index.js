import {
    searchMultiselect,
    nonSelectedText,
    textButtonShow
} from './allStrings'

var patientSelected = null;
import ReactDOM from "react-dom";
import React from "react";
import { MyFirstGrid } from './initDashboard';
import { searchPatient} from './searchScript';
import { createChart, processData } from './createChart';

const contentDiv = document.getElementById("root");
const gridProps = window.gridProps || {};
ReactDOM.render(React.createElement(MyFirstGrid, gridProps), contentDiv);

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

//create multiselection
$(document).ready(function () {
    $('#selectValue').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: searchMultiselect,
        nonSelectedText: nonSelectedText,
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



//get all patients ajax function
$(document).ready(function () {
    $.ajax({
        type: 'POST',
        url: 'PatientData',
        dataType: 'json',
        success: function (response) {
            fillPatientTable(response);
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
    $("#patientName").html(data[0].Name);
    $("#ageSpan").html(getAge(data[0].DateOfBirth));
    $("#sexSpan").html(data[0].Gender[0].toUpperCase()+data[0].Gender.slice(1));
    $("#bloodSpan").html(data[0].BloodType);
    $("#measurementTable").empty();
    $("#tableVisitDate").empty();
    $('#noteVisit').empty();
    $("#tableVisitDate").off("click","button");
    patientSelected = data; //patient selected
    var table = null;
    if(data.length > 1) {
        var dataVisit = new Date(data[1].Date);
        var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
        table += "<tr><td>" + data[0].ID + "</td>"
            + "<td>" + formatDate + "</td>"
            + "<td><button type='button' class='btn btn-primary' value='"+data[1].Date+"'>"+ textButtonShow +"</button></td>"
            + "</tr>"
        var precedentData = dataVisit;
        for (var i = 2; i < data.length; i++) {
            dataVisit = new Date(data[i].Date);
            if (dataVisit.getTime() != precedentData.getTime()) {
                var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
                table += "<tr><td>" + data[0].ID + "</td>"
                    + "<td>" + formatDate + "</td>"
                    + "<td><button type='button' class='btn btn-primary' value='"+data[i].Date+"'>"+ textButtonShow +"</button></td>"
                    + "</tr>"
            }
            precedentData = dataVisit;
        }

        $("#tableVisitDate").html(table);
        $("#tableVisitDate").on("click","button", function () {
            measurementTableUpdate(this.value);
        });
        //call to the funciont to create the chart
        createChart(patientSelected);
        fillSelect(data);
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
    if (patientSelected != null) {
        var date = new Date(visitDate);
        for (var i = 1; i < patientSelected.length; i++) {
            if (patientSelected[i].Date.getTime() == date.getTime()) {
                dataSelected.push(patientSelected[i]);
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
