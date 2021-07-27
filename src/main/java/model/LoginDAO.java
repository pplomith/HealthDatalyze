package model;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LoginDAO {
    public Doctor checkDoctor(String email, String pw) {

        try (Connection con = ConPool.getConnection()) {

            PreparedStatement ps = con.prepareStatement("SELECT * FROM medicaldoctor");
            ResultSet rs = ps.executeQuery();
            Doctor doc = null;
            while (rs.next()) {
                if (rs.getString("email").equals(email))
                {
                    if (checkPassword(rs.getString("password"), pw))
                    {
                        doc = new Doctor(Integer.parseInt(rs.getString("doctorId")),
                                rs.getString("firstName"),
                                rs.getString("lastName"));
                    }
                    break;
                }
            }
            return doc;

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        return null;
    }

    private boolean checkPassword(String pwDB, String pw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            digest.reset();
            digest.update(pw.getBytes(StandardCharsets.UTF_8));
            String passwordHash = String.format("%040x", new BigInteger(1, digest.digest()));
            return passwordHash.equals(pwDB);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
