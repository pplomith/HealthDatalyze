package model;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PatientDAO {

    public JSONObject getAllPatients() {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT * FROM patient");
            JSONObject rootObject = new JSONObject();

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
            rootObject.put("Patients", arrayObject);

            return rootObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }


        return null;
    }

    public JSONObject getPatientAndVD(String id) {

        try (Connection con = ConPool.getConnection()) {
            PreparedStatement ps = con.prepareStatement("SELECT * FROM patient as p WHERE p.PatientId = ?");
            JSONObject rootObject = new JSONObject();

            ps.setString(1,id);

            JSONArray patient = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("ID", rs.getString("PatientId"));
                object.put("Name", rs.getString("FirstName") + " " + rs.getString("LastName"));
                object.put("Gender", rs.getString("Gender"));
                object.put("BloodType", rs.getString("BloodType"));
                object.put("Height", rs.getString("Height"));
                object.put("DateOfBirth", rs.getString("DateOfBirth"));
                patient.add(object);
            }
            rootObject.put("Patient", patient);

            ps = con.prepareStatement("SELECT vd.Date, part.Short_Name, vd.Value, vd.Comment " +
                    "FROM patient as p, visitdata as vd, part as part"
                    + " WHERE p.PatientId = ? AND vd.Part = part.LOINC AND p.PatientId = vd.Patient");

            ps.setString(1,id);

            rs = ps.executeQuery();

            JSONArray visitData = new JSONArray();

            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("Date", rs.getString("Date"));
                object.put("Measurement", rs.getString("Short_Name"));
                object.put("Value", rs.getString("Value"));
                object.put("Comment", rs.getString("Comment"));
                visitData.add(object);
            }

            rootObject.put("DataPatient",visitData);


            ps = con.prepareStatement("SELECT * " +
                    "FROM patient as p, vitalsigns as vs"
                    + " WHERE p.PatientId = ? AND p.PatientId = vs.Patient");

            ps.setString(1,id);

            rs = ps.executeQuery();

            JSONArray vitalSigns = new JSONArray();

            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("Date", rs.getString("Date"));
                object.put("Name", rs.getString("Name"));
                object.put("Value", rs.getString("Value"));
                vitalSigns.add(object);
            }

            rootObject.put("VitalSigns",vitalSigns);

            return rootObject;

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        return null;
    }
}
