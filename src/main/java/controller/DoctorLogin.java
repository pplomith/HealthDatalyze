package controller;

import model.Doctor;
import model.LoginDAO;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
//servlet to manage user login
@WebServlet("/Login")
public class DoctorLogin extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doPost(request,response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String requestId = request.getParameter("requestId");
        HttpSession session = request.getSession();
        LoginDAO lDao = new LoginDAO();
        if (email != null && password != null && requestId == null) {
            //check if the user exists in the database and the data is correct
            Doctor doc = checkDataDoctor(email, password, lDao);
            if (doc == null) { //does not exist and sends the redirect to the login page
                RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
                dispatcher.forward(request,response);
            } else { //exists and correct data, entered in the session
                session.setAttribute("MedDoctor", doc);
                request.setAttribute("DoctorName", doc.getFirstName() + " " + doc.getLastName());
                request.setAttribute("DoctorID", doc.getId());
                RequestDispatcher dispatcher = request.getRequestDispatcher("index.jsp");
                dispatcher.forward(request,response);
            }
        } else if (email != null && password != null && requestId.equals("201")) { //login again when the session has expired
            String docId = request.getParameter("docId");
            Doctor doc = checkDataDoctor(email, password, lDao);
            if (doc == null || docId == null) {
                request.setCharacterEncoding("utf8");
                response.setContentType("text/plain");
                response.getWriter().write("login failed");
            } else {
                if (Integer.parseInt(docId) == doc.getId()) {
                    session.setAttribute("MedDoctor", doc);
                    request.setAttribute("DoctorName", doc.getFirstName() + " " + doc.getLastName());
                    request.setAttribute("DoctorID", doc.getId());
                    request.setCharacterEncoding("utf8");
                    response.setContentType("text/plain");
                    response.getWriter().write("login success");
                } else {
                    request.setCharacterEncoding("utf8");
                    response.setContentType("text/plain");
                    response.getWriter().write("login failed");
                }

            }
        } else {
            RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
            dispatcher.forward(request,response);
        }
    }

    private Doctor checkDataDoctor(String email, String password, LoginDAO lDao) {
        if (email.matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$")
                && email.length() > 5
                && password.length() > 7) {
            return lDao.checkDoctor(email, password);
        }
        return null;
    }


}
