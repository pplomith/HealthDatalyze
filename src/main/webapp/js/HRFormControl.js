var boolStartDate = false;
var boolEndDate = false;
var boolName = false;
var boolDescription = false;
var boolType = false;
export const formControl = () => {
    $('#saveHealthRecord').attr('disabled', true);
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


    $('#startDateHR').on('change', function () {
        var startDate = $('#startDateHR').val();
        $('#endDateHR').attr('min', startDate);
        checkDate(startDate, $('#endDateHR').val());
        checkFields();
    });
    $('#endDateHR').on('change', function () {
        checkDate($('#startDateHR').val(), $('#endDateHR').val());
        checkFields();
    });

    $('#selectTypeHealthRecord').on('change', function () {
        checkType($(this).val());
        checkDate($('#startDateHR').val(), $('#endDateHR').val());
        checkFields();
    });

    $('#nameHealthRecord').on('input', function () {
        checkName($(this).val());
        checkFields();
    });

    $('#descriptionRecord').on('input', function () {
        checkDescription($(this).val());
        checkFields();
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
    }
}

function checkName(text) {
    if (text.match(/^[a-zA-Z0-9]+/) && text.length > 1) {
        boolName = true;
        $("#nameHealthRecord").css("color","#266202");
    } else {
        boolName = false;
        $("#nameHealthRecord").css("color","#FF0000");
    }
}
function checkDescription(text) {
    if (text.match(/^[a-zA-Z0-9]+/)  && text.length > 2) {
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
