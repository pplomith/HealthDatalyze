//code to verify the correctness of the fields in the creation of the new clinical event
var boolStartDate = false;
var boolEndDate = false;
var boolName = false;
var boolDescription = false;
var boolType = false;
export const formControl = () => {
    $('#saveHealthRecord').attr('disabled', true);
    //initial setting
    $('#add-healthRecord').on('click', function () {
        $('#startDateHR').val('');
        $('#endDateHR').val('');
        $('#descriptionRecord').val('');
        $('#nameHealthRecord').val('');
        $('#selectTypeHealthRecord').val('');
        $("#startDateHR").css("color","black");
        $("#endDateHR").css("color","black");
        $("#descriptionRecord").css("color","black");
        $("#nameHealthRecord").css("color","black");
        $("#selectTypeHealthRecord").css("color","black");
    });
    //event listener for when the start date entry changes
    $('#startDateHR').on('change', function () {
        var startDate = $('#startDateHR').val();
        $('#endDateHR').attr('min', startDate); //minimum value of the end date set to the start date
        checkDate(startDate, $('#endDateHR').val()); //check the correctness of the dates
        checkFields(); //checks if all booleans are true
    });
    //event listener for when the end date entry changes
    $('#endDateHR').on('change', function () {
        checkDate($('#startDateHR').val(), $('#endDateHR').val()); //check the correctness of the dates
        checkFields(); //checks if all booleans are true
    });
    //listener of events for when the voice of the type changes
    $('#selectTypeHealthRecord').on('change', function () {
        checkType($(this).val()); //check the correctness of the type
        checkDate($('#startDateHR').val(), $('#endDateHR').val()); //check the correctness of the dates
        checkFields(); //checks if all booleans are true
    });
    //events listener for when the name is changed
    $('#nameHealthRecord').on('input', function () {
        checkName($(this).val()); //check the correctness of the name
        checkFields(); //checks if all booleans are true
    });
    //events listener for when the description is changed
    $('#descriptionRecord').on('input', function () {
        checkDescription($(this).val()); //check the correctness of the description
        checkFields(); //checks if all booleans are true
    });
}

function checkType(val) {
    if (val != 'null') {
        boolType = true;
        $("#selectTypeHealthRecord").css("color","#266202");
    } else {
        boolType = false;
        $("#selectTypeHealthRecord").css("color","#FF0000");
    }
}

function checkDate(startDate, endDate) {
    if (endDate == '' && startDate != '' && $('#selectTypeHealthRecord').val() != 'medicine') {
        boolStartDate = true;
        boolEndDate = true;
        $("#startDateHR").css("color","#266202");
        $("#endDateHR").css("color","#266202");
    } else if (startDate != '') {
        if (new Date(startDate).getTime() <= new Date(endDate).getTime()) {
            boolStartDate = true;
            boolEndDate = true;
            $("#startDateHR").css("color","#266202");
            $("#endDateHR").css("color","#266202");
        } else {
            boolStartDate = false;
            boolEndDate = false;
            $("#startDateHR").css("color","#FF0000");
            $("#endDateHR").css("color","#FF0000");
        }
    } else {
        boolStartDate = false;
        boolEndDate = false;
        $("#startDateHR").css("color","#FF0000");
        $("#endDateHR").css("color","#FF0000");
    }
}

function checkName(text) {
    if (text.match(/^[a-zA-Z0-9_ ]*$/) && text.length > 1) {
        boolName = true;
        $("#nameHealthRecord").css("color","#266202");
    } else {
        boolName = false;
        $("#nameHealthRecord").css("color","#FF0000");
    }
}
function checkDescription(text) {
    if (text.match(/^[a-zA-Z0-9_ ]*$/)  && text.length > 2) {
        boolDescription = true;
        $("#descriptionRecord").css("color","#266202");
    } else {
        boolDescription = false;
        $("#descriptionRecord").css("color","#FF0000");
    }
}

function checkFields() {
    if (boolDescription && boolStartDate && boolEndDate && boolType && boolName)
        $('#saveHealthRecord').removeAttr('disabled');
    else
        $('#saveHealthRecord').attr('disabled', true);
}
