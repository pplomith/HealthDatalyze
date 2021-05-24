import {select} from 'd3';
import ReactDOM from "react-dom";
import React from "react";
import { MyFirstGrid } from './initDashboard';
import { searchPatient } from './searchScript';

const contentDiv = document.getElementById("root");
const gridProps = window.gridProps || {};
ReactDOM.render(React.createElement(MyFirstGrid, gridProps), contentDiv);

$('#searchPatient').keyup(searchPatient);

const svg = select('svg');

var svgElement = document.getElementById("svgId");
const width = svgElement.viewBox.baseVal.width;
const heigth = svgElement.viewBox.baseVal.height;

var patientSelected = null;


const dataPrint =  (data) => {
    data.forEach(d => {
        d.Value = +d.Value;
        d.Date = new Date(d.Date);
    });
    console.log(data);
}

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

function getJson() {
    $.ajax({
        type: 'POST',
        url: 'GetData',
        dataType: 'json',
        success: function (response) {
            dataPrint(response);
        }

    });
}

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
    console.log(data);
    patientSelected = data;
    var table = null;
    if(data.length > 1) {
        var dataVisit = new Date(data[1].Date);
        var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
        table += "<tr><td>" + data[0].ID + "</td>"
            + "<td>" + formatDate + "</td>"
            + "<td><button type='button' class='btn btn-primary' value='"+data[1].Date+"'>Show</button></td>"
            + "</tr>"
        var precedentData = dataVisit;
        for (var i = 2; i < data.length; i++) {
            dataVisit = new Date(data[i].Date);
            if (dataVisit.getTime() != precedentData.getTime()) {
                var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
                table += "<tr><td>" + data[0].ID + "</td>"
                    + "<td>" + formatDate + "</td>"
                    + "<td><button type='button' class='btn btn-primary' value='"+data[i].Date+"'>Show</button></td>"
                    + "</tr>"
            }
            precedentData = dataVisit;
        }

        $("#tableVisitDate").html(table);
        $("#tableVisitDate").on("click","button", function () {
            measurementTableUpdate(this.value);
        });
    }
    function getAge(dateOfBirth) {
        var today = Date.now();
        var birth = new Date(dateOfBirth);
        return parseInt((today - birth.getTime()) / (1000*60*60*24*365));
    }
}

function measurementTableUpdate(visitDate) {

    var table, cmt = null;

    let dataSelected = [];
    if (patientSelected != null) {

        for (var i = 1; i < patientSelected.length; i++) {
            if (patientSelected[i].Date == visitDate) {
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
