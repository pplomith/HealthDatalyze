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

            PreparedStatement ps = con.prepareStatement("SELECT vd.Patient, p.FirstName, p.LastName, p.BloodType, p.DateOfBirth, p.Gender, p.Height, vd.Date, part.Short_Name, vd.Value " +
                    "FROM meddata.patient as p, meddata.visitdata as vd, meddata.part as part"
                    + " WHERE p.PatientId = ? AND vd.Part = part.LOINC AND p.PatientId = vd.Patient");

            ps.setString(1,id);

            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("ID", rs.getString("Patient"));
                object.put("Name", rs.getString("FirstName") + " " + rs.getString("LastName"));
                object.put("BloodType", rs.getString("BloodType"));
                object.put("DateOfBirth", rs.getString("DateOfBirth"));
                object.put("Gender", rs.getString("Gender"));
                object.put("Height", rs.getString("Height"));
                object.put("Date", rs.getString("Date"));
                object.put("Measurement", rs.getString("Short_Name"));
                object.put("Value", rs.getString("Value"));
                arrayObject.add(object);
            }
            return arrayObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }


        return null;
    }
}
