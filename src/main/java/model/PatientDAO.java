package model;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PatientDAO {

    public JSONArray getAllPatients() {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT * FROM meddata.patient");

            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("ID", rs.getString("PatientId"));
                object.put("Name", rs.getString("FirstName") + " " + rs.getString("LastName"));
                object.put("Gender", rs.getString("Gender"));
                object.put("BloodType", rs.getString("BloodType"));
                object.put("Height", rs.getString("Height"));
                object.put("DateOfBirth", rs.getString("DateOfBirth"));
                arrayObject.add(object);
            }
            return arrayObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }


        return null;
    }

    public JSONArray getPatientAndVD(String id) {

        try (Connection con = ConPool.getConnection()) {
            PreparedStatement ps = con.prepareStatement("SELECT * FROM meddata.patient as p WHERE p.PatientId = ?");

            ps.setString(1,id);
            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("ID", rs.getString("PatientId"));
                object.put("Name", rs.getString("FirstName") + " " + rs.getString("LastName"));
                object.put("Gender", rs.getString("Gender"));
                object.put("BloodType", rs.getString("BloodType"));
                object.put("Height", rs.getString("Height"));
                object.put("DateOfBirth", rs.getString("DateOfBirth"));
                arrayObject.add(object);
            }

            ps = con.prepareStatement("SELECT vd.Date, part.Short_Name, vd.Value, vd.Comment " +
                    "FROM meddata.patient as p, meddata.visitdata as vd, meddata.part as part"
                    + " WHERE p.PatientId = ? AND vd.Part = part.LOINC AND p.PatientId = vd.Patient");

            ps.setString(1,id);

            rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("Date", rs.getString("Date"));
                object.put("Measurement", rs.getString("Short_Name"));
                object.put("Value", rs.getString("Value"));
                object.put("Comment", rs.getString("Comment"));
                arrayObject.add(object);
            }

            return arrayObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        return null;
    }
}
