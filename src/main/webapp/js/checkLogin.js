var checkBoolEmail = false;
var checkBoolPw = false;

function checkEmail() {
    var email = $('#email').val();
    if (email.length > 5 &&
        email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        checkBoolEmail = true;
        $("#email").css("border-color","black");
    } else {
        checkBoolEmail = false;
        $("#email").css("border-color","#861529");
    }
    checkBool();
}

function checkPw() {
    var pw = $('#password').val();
    if (pw.length > 7) {
        checkBoolPw = true;
        $("#password").css("border-color","black");
    } else {
        checkBoolPw = false;
        $("#password").css("border-color","#861529");
    }
    checkBool();
}

function checkBool() {
    if (checkBoolEmail && checkBoolPw) {
        $('#btnLogin').removeAttr('disabled');
    } else {
        $('#btnLogin').attr('disabled', true);
    }
}