package model;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

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

    public JSONObject getPatientData(String id) {

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

            JSONArray analysisData = new JSONArray();

            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("Date", rs.getString("Date"));
                object.put("Measurement", rs.getString("Short_Name"));
                object.put("Value", rs.getString("Value"));
                object.put("Comment", rs.getString("Comment"));
                analysisData.add(object);
            }

            rootObject.put("DataPatient",analysisData);

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

            ps = con.prepareStatement("SELECT * " +
                    "FROM patient as p, eventsdata as ed"
                    + " WHERE p.PatientId = ? AND p.PatientId = ed.patientId");

            ps.setString(1,id);

            JSONArray eventsData = new JSONArray();
            String dataPattern = "yyyy-MM-dd'T'HH:mm:ss";
            String dataFormat = "yyyy-MM-dd hh:mm aa";
            ArrayList<String> dateList = new ArrayList<>();

            int phdId = 1;
            for (int i = 0; i < analysisData.size(); i++) {
                JSONObject item = (JSONObject) analysisData.get(i);
                JSONObject object = new JSONObject();
                String dataItem = (String) item.get("Date");
                if (!dateList.contains(dataItem)) {
                    dateList.add(dataItem);
                    String title;
                    object.put("id", null);
                    object.put("group", "102");
                    title = "Clinical Analysis #"+phdId+": ";
                    title += getCommentPHR(analysisData, dataItem);
                    object.put("content", "PHR #"+phdId);
                    object.put("start", item.get("Date"));
                    Date startDate = new SimpleDateFormat(dataPattern).parse((String) item.get("Date"));
                    title += "Date: " + new SimpleDateFormat(dataFormat).format(startDate);
                    object.put("end", null);
                    object.put("title", title);
                    object.put("type", "clinical analysis");
                    eventsData.add(object);
                    phdId++;
                }
            }
            rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                String title;
                object.put("id", rs.getString("id"));
                object.put("group", rs.getString("groupId"));
                title = rs.getString("content") + ' ';
                StringBuilder sb = new StringBuilder(rs.getString("comment"));
                int i = 0;
                while (i + 50 < sb.length() && (i = sb.lastIndexOf(" ", i + 50)) != -1) {
                    sb.replace(i, i + 1, "<br>");
                }
                title += sb.toString();
                object.put("content", rs.getString("content"));
                object.put("start", rs.getString("startDate"));
                Date startDate = new SimpleDateFormat(dataPattern).parse(rs.getString("startDate"));
                if (rs.getString("endDate") != null) {
                    object.put("end", rs.getString("endDate"));
                    Date endDate = new SimpleDateFormat(dataPattern).parse(rs.getString("endDate"));
                    title += "<br>From: " + new SimpleDateFormat(dataFormat).format(startDate)+
                            "<br>To: " + new SimpleDateFormat(dataFormat).format(endDate);
                    if (rs.getString("doctorID") != null) {
                        title += "<br>M.D.: " + getDoctorName(Integer.parseInt(rs.getString("doctorID")), con) +
                                " #" + rs.getString("doctorID");
                    }
                }
                else {
                    title += "<br>Date: " + new SimpleDateFormat(dataFormat).format(startDate);
                    if (rs.getString("doctorID") != null) {
                        title += "<br>M.D.: " + getDoctorName(Integer.parseInt(rs.getString("doctorID")), con) +
                                " #" + rs.getString("doctorID");
                    }
                    object.put("end", null);
                }
                object.put("title", title);
                object.put("type", rs.getString("type"));
                if (rs.getString("type").equals("diagnostic radiology"))
                    putImg(object, rs.getString("id"), con);
                eventsData.add(object);
            }

            rootObject.put("TimelineData",eventsData);

            return rootObject;

        } catch (SQLException | ParseException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    private String getCommentPHR(JSONArray analysisData, String data) {
        String cnt = "<ul>";
        for (int i = 0; i < analysisData.size(); i++) {
            JSONObject item = (JSONObject) analysisData.get(i);
            if (item.get("Date").equals(data)) {
                float vFloat = Float.parseFloat(String.valueOf(item.get("Value")));
                cnt += "<li>" +item.get("Measurement") + ": " + String.format(Locale.US,"%.2f", vFloat) + "</li>";
            }
        }
        cnt += "</ul>";
        return cnt;
    }

    private void putImg(JSONObject object, String id, Connection con) throws SQLException {
        PreparedStatement ps = con.prepareStatement("SELECT r.pathImg " +
                "FROM radiologyimg as r, eventsdata as ed"
                + " WHERE r.radId = ed.id AND ed.id = ?");
        ps.setString(1,id);
        ResultSet rs = ps.executeQuery();
        int i = 1;
        JSONArray arrayImg = new JSONArray();
        while (rs.next()) {
            arrayImg.add(rs.getString("pathImg"));
            i++;
        }
        object.put("pathImg", arrayImg);
    }

    private String getDoctorName(int docId, Connection con) throws SQLException {
        PreparedStatement ps = con.prepareStatement("SELECT d.firstName, d.lastName " +
                "FROM medicaldoctor as d"
                + " WHERE d.doctorId = ?");
        ps.setInt(1, docId);
        ResultSet rs = ps.executeQuery();
        String dN = "";
        while (rs.next()) {
            dN = rs.getString("firstName") + " " + rs.getString("lastName");
        }
        return dN;
    }

    public boolean doSaveHR(String pId, String gId, String content, String sDate, String eDate, String cmt, String type, int doctorId) {
        try (Connection con = ConPool.getConnection()) {
            PreparedStatement ps = con.prepareStatement("insert into eventsdata("
                    + "patientId, groupId, content, startDate, endDate, comment, type, doctorID)"
                    + "values(?, ?, ?, ?, ?, ?, ?, ?)");

            ps.setString(1, pId);
            ps.setString(2, gId);
            ps.setString(3, content);
            ps.setString(4, sDate);
            ps.setString(5, eDate);
            ps.setString(6, cmt);
            ps.setString(7, type);
            ps.setInt(8, doctorId);

            ps.executeUpdate();
            return true;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return false;
    }
}
