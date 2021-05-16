import {select} from 'd3';

const svg = select('svg');
const width = +svg.attr('width');



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

// var button = document.querySelector("#buttonForJson");
// button.addEventListener("click", getJson);

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
                visitDatePatient(response)
            }
        });
    });
}

function visitDatePatient(data) {
    var table = null;
    if(data.length > 0) {
        var dataVisit = new Date(data[0].Date);
        var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
        table += "<tr><td>" + data[0].ID + "</td>"
            + "<td>" + formatDate + "</td>"
            + "<td><button type='button' class='btn btn-primary'>Show</button></td>"
            + "</tr>"
        var precedentData = dataVisit;
        for (var i = 1; i < data.length; i++) {
            dataVisit = new Date(data[i].Date);
            if (dataVisit.getTime() != precedentData.getTime()) {
                var formatDate = dataVisit.getFullYear() + "-" + (dataVisit.getMonth() + 1) + "-" + dataVisit.getDate();
                table += "<tr><td>" + data[i].ID + "</td>"
                    + "<td>" + formatDate + "</td>"
                    + "<td><button type='button' class='btn btn-primary'>Show</button></td>"
                    + "</tr>"
            }
            precedentData = dataVisit;
        }

        $("#tableVisitDate").html(table);
    }
}