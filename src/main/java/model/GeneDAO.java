package model;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GeneDAO {

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
                        object.put("patientId", rs.getString("patientId"));
                        object.put("patientName", rs.getString("FirstName") +" "+rs.getString("LastName"));
                        object.put("geneId", rs.getString("id"));
                        object.put("geneSymbol", rs.getString("Symbol"));
                        object.put("geneName", rs.getString("Name"));
                        object.put("value", rs.getString("value"));
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

}
