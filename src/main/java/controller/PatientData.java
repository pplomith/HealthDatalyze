package controller;

import model.PatientDAO;
import org.json.simple.JSONArray;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/PatientData")
public class PatientData extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request,response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PatientDAO patientDAO = new PatientDAO();
        JSONArray jsonObject = null;

        String patientId = request.getParameter("id");

        if (patientId != null) {
            jsonObject = patientDAO.getVisitDatePatient(patientId);
        }
        else {
            jsonObject = patientDAO.getAllPatients();
        }

        request.setCharacterEncoding("utf8");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(jsonObject.toString());


    }
}
