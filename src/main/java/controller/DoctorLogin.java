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

@WebServlet("/Login")
public class DoctorLogin extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doPost(request,response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        HttpSession session = request.getSession();
        LoginDAO lDao = new LoginDAO();
        if (email != null && password != null) {
            if (email.matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$")
            && email.length() > 5
            && password.length() > 7) {
                Doctor doc = lDao.checkDoctor(email, password);
                if (doc == null) {
                    RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
                    dispatcher.forward(request,response);
                } else {
                    session.setAttribute("MedDoctor", doc);
                    request.setAttribute("DoctorName", doc.getFirstName() + " " + doc.getLastName());
                    request.setAttribute("DoctorID", doc.getId());
                    RequestDispatcher dispatcher = request.getRequestDispatcher("index.jsp");
                    dispatcher.forward(request,response);
                }
            }
        }

        RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
        dispatcher.forward(request,response);
    }
}
