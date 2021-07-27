<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>HealthDatalyze</title>
    <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles_login.css">
</head>
<body style="background: rgba(224,224,224,0.5); font-family: 'Poppins';">
<div class="registration-form">
    <form class="form" role="form" action="Login" method="post">
        <h4 id="title-form">HealthDatalyze</h4>
        <div class="form-icon">
            <span><i class="icon icon-user"></i></span>
        </div>
        <div class="form-group">
            <input type="text" name="email" class="form-control item" id="email" placeholder="Email" oninput="checkEmail()">
        </div>
        <div class="form-group">
            <input type="password" name="password" class="form-control item" id="password" placeholder="Password" oninput="checkPw()">
        </div>
        <div class="form-group">
            <input type="submit" id="btnLogin" class="btn btn-primary btn-block create-account" value="Login" disabled/>
        </div>
    </form>
    <div class="social-media">
        <h5>Test Credentials</h5>
        <div class="social-icons">
            <ul>
                <li>j.parker@meddoctor.org - DocJParker</li>
                <li>m.bjorn@meddoctor.org - DocMBjorn</li>
                <li>s.diesel@meddoctor.org - DocSDiesel</li>
            </ul>
        </div>
    </div>
</div>
<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js"></script>
<script src="js/checkLogin.js"></script>
</body>
</html>
