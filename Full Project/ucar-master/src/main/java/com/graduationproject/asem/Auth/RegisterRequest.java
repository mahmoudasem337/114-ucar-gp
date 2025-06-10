package com.graduationproject.asem.Auth;

public class RegisterRequest {

    private String username;
    private String phonenumber;
    private String email;
    private String password;

    public RegisterRequest(String firstname, String phonenumber, String email, String password) {
        this.username = firstname;
        this.phonenumber = phonenumber;
        this.email = email;
        this.password = password;
    }

    public RegisterRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
