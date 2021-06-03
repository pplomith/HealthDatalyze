package model;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LayoutDAO {

    public boolean saveLayout(String id, String lName, String layouts) {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("DELETE FROM layoutconfig WHERE layoutid = ?");
            ps.setString(1, id);
            int rs = ps.executeUpdate();

             ps = con.prepareStatement("INSERT INTO layoutconfig(LayoutId, LayoutName, layouts) values (?, ?, ?)");

             ps.setString(1, id);
             ps.setString(2, lName);
             ps.setString(3, layouts);

             rs = ps.executeUpdate();
             return true;
        } catch (SQLException throwables) {
            return false;
        }

    }

    public String getLayout(String lId) {
        String result = null;
        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT layouts FROM layoutconfig WHERE layoutId = ?");
            ps.setString(1, lId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                result = rs.getString("layouts");
            }
            return result;
        } catch (SQLException throwables) {
            return result;
        }
    }

    public int getId() {
        try (Connection con = ConPool.getConnection()) {
            int id = -1;
            PreparedStatement ps = con.prepareStatement("SELECT layoutid FROM (SELECT '1' AS layoutid) q1 WHERE NOT EXISTS (SELECT '1' FROM layoutconfig WHERE layoutid = '1')" +
                    "UNION ALL SELECT * FROM (SELECT  layoutid + '1' FROM layoutconfig t WHERE NOT EXISTS (SELECT '1' FROM layoutconfig ti WHERE ti.layoutid = t.layoutid + '1' ) ORDER BY layoutid LIMIT 1) q2 ORDER BY layoutid LIMIT 1");

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                id = rs.getInt("layoutid");
            }
            return id;
        } catch (SQLException throwables) {
            return -1;
        }
    }

    public boolean deleteLayout(String id) {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("DELETE FROM layoutconfig WHERE layoutid = ?");
            ps.setString(1, id);
            int rs = ps.executeUpdate();

            return true;
        } catch (SQLException throwables) {
            return false;
        }

    }

    public JSONArray getAllLayouts() {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT layoutId, layoutName FROM layoutconfig");

            JSONArray arrayObject = new JSONArray();
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject object = new JSONObject();
                object.put("layoutId", rs.getString("layoutId"));
                object.put("layoutName", rs.getString("layoutName"));
                arrayObject.add(object);
            }
            return arrayObject;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }


        return null;
    }

}
