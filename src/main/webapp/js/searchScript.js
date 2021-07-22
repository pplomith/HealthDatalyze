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


export const filterDatePHR = (startDate, endDate) => {
    var input, filter, table, tr, td, i, txtValue;
    table = document.getElementById("tableVisitDate");
    tr = table.getElementsByTagName("tr");
    input = $('#selectTypeInfo option:selected').val();
    filter = input.toUpperCase();
    for (i = 0; i < tr.length; i++) {
        if ((startDate == '' || endDate == '') && input == 'all') {
            tr[i].style.display = "";
        } else {
            var td_type = tr[i].getElementsByTagName("td")[3];
            var td_startDate = tr[i].getElementsByTagName("td")[1];
            var td_endDate = tr[i].getElementsByTagName("td")[2];
            if (td_startDate || td_endDate || td_type) {
                var txtValue_id = td_type.textContent || td_type.innerText;
                var txtStartDate = td_startDate.textContent || td_startDate.innerText;
                var txtEndDate = td_endDate.textContent || td_endDate.innerText;
                if (startDate == '' || endDate == '') {
                    if (txtValue_id.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                } else {
                    var sDate = new Date(startDate);
                    var eDate = new Date(endDate);
                    var txtSDate = new Date(txtStartDate);
                    if (txtEndDate == '/') {
                        if (input == 'all') {
                            if (txtSDate.getTime() >= sDate.getTime() && txtSDate.getTime() <= eDate.getTime())
                                tr[i].style.display = "";
                            else
                                tr[i].style.display = "none";
                        } else if (txtSDate.getTime() >= sDate.getTime() && txtSDate.getTime() <= eDate.getTime()
                            && txtValue_id.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    } else {
                        var txtEDate = new Date(txtEndDate);
                        if (txtSDate.getTime() >= sDate.getTime() && txtEDate.getTime() <= eDate.getTime() && txtValue_id.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else if (input == 'all') {
                            if (txtSDate.getTime() >= sDate.getTime() && txtEDate.getTime() <= eDate.getTime()) {
                                tr[i].style.display = "";
                            } else {
                                tr[i].style.display = "none";
                            }
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        }
    }
}