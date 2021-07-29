package controller;

import model.Doctor;
import model.PatientDAO;
import org.json.simple.JSONObject;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

@WebServlet("/PatientData")
public class PatientData extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doPost(request,response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            PatientDAO patientDAO = new PatientDAO();
            JSONObject jsonObject = null;
            String patientId = request.getParameter("id");
            String reqId = request.getParameter("requestId");
            if (patientId != null && reqId == null) {
                jsonObject = patientDAO.getPatientData(patientId);
            }
            else if (reqId == null){
                jsonObject = patientDAO.getAllPatients();
            } else if (reqId.equals("105")) {
                String startDate = request.getParameter("startDate");
                String endDate = request.getParameter("endDate");
                String name = request.getParameter("name");
                String type = request.getParameter("type");
                String description = request.getParameter("description");
                String groupId = request.getParameter("groupId");
                boolean checkDate = false, checkName = false, checkType = false, checkDescr = false;
                if (endDate.equals("")) endDate = null;
                if (session.getAttribute("MedDoctor") != null) {
                    Doctor doc = (Doctor) session.getAttribute("MedDoctor");
                    if (endDate != null && new Date(startDate).getTime() <= new Date(endDate).getTime())
                        checkDate = true;
                    else if (endDate == null && startDate != null)
                        checkDate = true;
                    if (name.matches("^[a-zA-Z0-9]+") && name.length() > 1)
                        checkName = true;
                    if (description.matches("^[a-zA-Z0-9]+") && description.length() > 2)
                        checkDescr = true;
                    if (type != null && !type.equals(""))
                        checkType = true;
                    System.out.println(checkDate + " " + checkDescr + " " + checkName + " " + checkType);
                    if (checkDate && checkDescr && checkName && checkType)
                        patientDAO.doSaveHR(patientId, groupId, name, startDate, endDate, description, type, doc.getId());
                }
                jsonObject = patientDAO.getPatientData(patientId);
            }
            if (jsonObject != null) {
                request.setCharacterEncoding("utf8");
                response.setContentType("application/json");
                PrintWriter out = response.getWriter();
                out.print(jsonObject.toString());
            } else {
                request.setCharacterEncoding("utf8");
                response.setContentType("text/plain");
                response.getWriter().write("Server Error");
            }
        } else {
            RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
            dispatcher.forward(request,response);
        }
    }
}
