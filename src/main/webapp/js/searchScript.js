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