// function to filter patients
export const searchPatient = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchPatient");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableAllPatient");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        var td_id = tr[i].getElementsByTagName("td")[1];
        var td_name = tr[i].getElementsByTagName("td")[2];
        if (td_id || td_name) {
            var txtValue_id = td_id.textContent || td_id.innerText;
            var txtValue_name = td_name.textContent || td_name.innerText;
            if (txtValue_id.toUpperCase().indexOf(filter) > -1 || txtValue_name.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

    }
}

//function to create formatted text (information description or text in legend chart)
export const wrap = (text, width) => {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em")
        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", `${lineHeight + dy}em`).text(word)
            }
        }
    })
}

//function to apply filters to the table that displays all clinical information
export const filterDatePHR = (startDate, endDate) => {
    var input, filter, table, tr, td, i, txtValue;
    //get table by id
    table = document.getElementById("tableVisitDate");
    //get all 'tr' elements
    tr = table.getElementsByTagName("tr");
    //type selected
    input = $('#selectTypeInfo option:selected').val();
    filter = input.toUpperCase();
    for (i = 0; i < tr.length; i++) {
        //no dates selected and all types
        if (startDate == '' && endDate == '' && input == 'all') {
            tr[i].style.display = "";
        } else {
            var td_type = tr[i].getElementsByTagName("td")[3];
            var td_startDate = tr[i].getElementsByTagName("td")[1];
            var td_endDate = tr[i].getElementsByTagName("td")[2];
            if (td_startDate || td_endDate || td_type) {
                //get the text displayed in three columns for each row (Type, Start Date, End Date)
                var txtValue_id = td_type.textContent || td_type.innerText;
                var txtStartDate = td_startDate.textContent || td_startDate.innerText;
                var txtEndDate = td_endDate.textContent || td_endDate.innerText;
                //no date selected but check the filter
                if (startDate == '' && endDate == '') {
                    if (txtValue_id.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                } else {
                    var sDate;
                    var eDate;
                    var txtSDate = new Date(txtStartDate);
                    //selected start date
                    if (startDate != '' && endDate == '') {
                        sDate = new Date(startDate);
                        //check if the displayed start date is later than the selected date
                        if (txtSDate.getTime() >= sDate.getTime()) {
                            //check the selected type
                            if (input == 'all' || txtValue_id.toUpperCase().indexOf(filter) > -1)
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        } else //otherwise no row displayed
                            tr[i].style.display = "none";
                    } else if (startDate == '' && endDate != '') { //selected end date
                        eDate = new Date(endDate);
                        if (txtEndDate == '/') { //check if the end date of the table is not null
                            //check the type and start date displayed
                            if ((input == 'all' || txtValue_id.toUpperCase().indexOf(filter) > -1) && txtSDate.getTime() <= eDate.getTime())
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        } else {
                            //end date of the table is not null
                            if ((input == 'all' || txtValue_id.toUpperCase().indexOf(filter) > -1) && new Date(txtEndDate).getTime() <= eDate.getTime())
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        }
                    } else {
                        //both dates selcted
                        sDate = new Date(startDate);
                        eDate = new Date(endDate);
                        var txtEDate = new Date(txtEndDate);
                        if (txtEndDate == '/') { //check if the end date of the table is not null
                            //use only the start date
                            if (txtSDate.getTime() >= sDate.getTime() && txtSDate.getTime() <= eDate.getTime()
                                && ((input == 'all' || txtValue_id.toUpperCase().indexOf(filter) > -1)))
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        } else { //end date of the table is not null
                            //check if the end date and the start date of the table are within the selected range
                            if (txtSDate.getTime() >= sDate.getTime() && txtEDate.getTime() <= eDate.getTime()
                                && ((input == 'all' || txtValue_id.toUpperCase().indexOf(filter) > -1)))
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        }

                    }

                }
            }
        }
    }
}