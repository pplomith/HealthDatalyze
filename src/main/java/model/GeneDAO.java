package model;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GeneDAO {
    //obtaining all the names of the genes
    public JSONObject getAllGeneName() {
        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT id, Name FROM proteincodinggene");
            JSONObject rootObject = new JSONObject();

            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("id", rs.getString("id"));
                object.put("Name", rs.getString("Name"));
                arrayObject.add(object);
            }
            rootObject.put("Gene", arrayObject);

            return rootObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }
    //obtaining the data to build the heatmap
    public JSONObject getDataHeatmap(JSONArray genes, JSONArray patients) {
        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT g.id, g.Symbol, g.Name, gd.value, p.patientId, p.FirstName, p.LastName " +
                    "FROM proteincodinggene as g, patient as p, genedata as gd " +
                    "where gd.geneId = g.id and gd.patientId = p.PatientId " +
                    "and gd.geneId = ? and gd.patientId = ?");

            JSONObject rootObject = new JSONObject();

            JSONArray arrayObject = new JSONArray();
            for (int i = 0; i < patients.size(); i++) {
                for (int j = 0; j < genes.size(); j++) {
                    ps.setString(1, (String) genes.get(j));
                    ps.setString(2, (String) patients.get(i));
                    ResultSet rs = ps.executeQuery();
                    while (rs.next()) {
                        JSONObject object = new JSONObject();
                        object.put("Patient ID", rs.getString("patientId"));
                        object.put("Patient Name", rs.getString("FirstName") +" "+rs.getString("LastName"));
                        object.put("Gene ID", rs.getString("id"));
                        object.put("Symbol", rs.getString("Symbol"));
                        object.put("Name", rs.getString("Name"));
                        object.put("Value", rs.getString("value"));
                        arrayObject.add(object);
                    }
                }
            }

            rootObject.put("Data", arrayObject);

            return rootObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }
    //obtaining data for the scatter plot
    public JSONObject getDataScatterPlot() {
        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT *  FROM osteoarthritismicrorna");

            JSONObject rootObject = new JSONObject();

            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("id", rs.getString("id"));
                object.put("PC1", rs.getString("OsteoarthritisPC1"));
                object.put("PC2", rs.getString("OsteoarthritisPC2"));
                object.put("Osteoarthritis", rs.getString("Osteoarthritis"));
                object.put("sex", rs.getString("sex"));
                object.put("race", rs.getString("race"));
                object.put("age_cat", rs.getString("age_cat"));
                object.put("bmi_cat", rs.getString("bmi_cat"));
                arrayObject.add(object);
            }

            rootObject.put("Data", arrayObject);

            return rootObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

}
