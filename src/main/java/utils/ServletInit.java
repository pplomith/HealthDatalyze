package utils;


import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

//initial servlet
@WebServlet(name = "Home", urlPatterns = "", loadOnStartup = 1)
public class ServletInit extends HttpServlet {

    public void init() throws ServletException {
        super.init();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //creation of the session and loading of the login page
        HttpSession session = request.getSession(true);
        session.setMaxInactiveInterval(180*60);
        RequestDispatcher dispatcher = request.getRequestDispatcher("/view/login.jsp");
        dispatcher.forward(request,response);
    }


}
