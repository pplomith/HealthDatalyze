<%--
  Created by IntelliJ IDEA.
  User: Pollax
  Date: 15/05/2021
  Time: 18:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://unpkg.com/d3@5.6.0/dist/d3.min.js">
    </script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.cyan-light_blue.min.css">
    <link rel="stylesheet" href="css/style_index.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
<div class="mdl-grid main_div">

    <div class="sx_div">
        <div class="searchDiv">

            <span><i class="fa fa-search"></i></span>
            <input type="text" class="search_patient" id="searchPatient" placeholder="Search..." onkeyup="searchPatientTable()">
        </div>
        <div class="table_patient">

            <div class="table-responsive">

                <table id="tableAllPatient" class="table table-striped table-hover nowrap" style="width:100%">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Date of birth</th>
                        <th>Blood Type</th>
                        <th>Height</th>
                    </tr>
                    </thead>
                    <tbody id="patientTableBody">
                    </tbody>
                </table>

            </div>

        </div>


        <div class="table_visit_patient">

            <div class="table-responsive">

                <table class="table table-striped table-hover nowrap" style="width:100%">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Visit Date</th>
                        <th>Information</th>
                    </tr>
                    </thead>
                    <tbody id="tableVisitDate">
                    </tbody>
                </table>

            </div>

        </div>


        <div class="visit_data_div">
            <div class="table_data_visit">


                <div class="table-responsive">

                    <table class="table table-striped table-hover nowrap" style="width:100%">
                        <thead>
                        <tr>
                            <th>Measurement</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody id="measurementTable">
                        </tbody>
                    </table>

                </div>

            </div>

            <div class="div_note_visit">
            </div>
        </div>

    </div>


    <div class="dx_div">
        <div class="patient_info">

            <div class="personal_info">

            </div>


            <div class="helth_info">
                <div class="date_row">
                    <div class="inputDate">
                        <input type="date" name="startDate" id="startDate">
                    </div>
                    <div class="inputDate">
                        <input type="date" name="endDate" id="endDate">
                    </div>
                </div>
                <div class="first_row">
                    <div class="avg_info">
                    </div>
                    <div class="avg_info">
                    </div>
                </div>
                <div class="second_row">
                    <div class="avg_info">
                    </div>
                    <div class="avg_info">
                    </div>
                </div>
            </div>

        </div>

        <div class="div_filter">

        </div>

        <div class="div_graph">

            <svg>

            </svg>
        </div>

    </div>


</div>




</body>
<script type="text/javascript">



    function searchPatientTable() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchPatient");
        filter = input.value.toUpperCase();
        table = document.getElementById("tableAllPatient");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td_id = tr[i].getElementsByTagName("td")[1];
            td_name = tr[i].getElementsByTagName("td")[2];
            if (td_id || td_name) {
                txtValue_id = td_id.textContent || td_id.innerText;
                txtValue_name = td_name.textContent || td_name.innerText;
                if (txtValue_id.toUpperCase().indexOf(filter) > -1 || txtValue_name.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }

        }
    }
</script>

<script src = "js/bundle.js">

</script>
</html>
