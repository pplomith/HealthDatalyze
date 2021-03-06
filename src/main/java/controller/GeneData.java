package controller;

import model.GeneDAO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
//servlet that manages the obtaining of data on genes
@WebServlet("/GeneData")
public class GeneData extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request,response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        GeneDAO geneDAO = new GeneDAO();
        JSONObject jsonObject = null;
        String requestId = request.getParameter("requestId");
        if (requestId == null) { //obtaining all the names of the genes
            jsonObject = geneDAO.getAllGeneName();
        } else if (requestId.equals("100")) { //obtaining all data of the selected genes and patients
            String selectedGenes = request.getParameter("selectedGenes");
            String selectedPatients = request.getParameter("selectedPatients");
            if (selectedGenes != null && selectedPatients != null) {
                JSONParser parser = new JSONParser();
                try {
                    JSONArray genes = (JSONArray) parser.parse(selectedGenes);
                    JSONArray patients = (JSONArray) parser.parse(selectedPatients);
                    jsonObject = geneDAO.getDataHeatmap(genes, patients);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        } else if (requestId.equals("201")) { //obtaining the data for the construction of the scatter plot
                jsonObject = geneDAO.getDataScatterPlot();
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


    }
}
