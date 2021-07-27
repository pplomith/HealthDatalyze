package model;


public class Doctor {
    private String firstName;
    private String lastName;
    private int id;
    public Doctor(int id, String fName, String lName) {
        this.firstName = fName;
        this.lastName = lName;
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
