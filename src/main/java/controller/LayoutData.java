package controller;


import model.LayoutDAO;
import org.json.simple.JSONArray;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/LayoutConfig")
public class LayoutData extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        LayoutDAO lDao = new LayoutDAO();
        String lId = request.getParameter("layoutId");
        String lName = request.getParameter("layoutName");
        String lProps = request.getParameter("layouts");
        String boolDelete = request.getParameter("boolDelete");
        String boolAllLayout = request.getParameter("boolAllLayout");
        String result = "";
        if (boolAllLayout == null) {
            if (lName != null && lProps != null && lId != null) {
                boolean rs = lDao.saveLayout(lId, lName, lProps);
                if (rs) result = "success";
                else result = "failed";
            } else if (lId != null && boolDelete == null){
                String rs = lDao.getLayout(lId);
                if (rs != null) result = rs;
                else result = "failed";
            } else if (lId != null && boolDelete != null) {
                if(Boolean.parseBoolean(boolDelete)) {
                    boolean rs = lDao.deleteLayout(lId);
                    if (rs) result = "success";
                    else result = "failed";
                }
            } else {
                int rs = lDao.getId();
                if (rs != -1) result = "" + rs;
                else result = "failed";
            }

            response.setContentType("text/plain");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(result);
        } else {
            JSONArray jsonObject = null;
            jsonObject = lDao.getAllLayouts();
            request.setCharacterEncoding("utf8");
            response.setContentType("text/plain");
            if (jsonObject != null) {
                PrintWriter out = response.getWriter();
                out.print(jsonObject.toString());
            } else {
                response.getWriter().write("Server Error");
            }
        }
    }
}
