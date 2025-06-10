package com.graduationproject.asem.Auth;

public class AuthenicationResponse {
    private String token;

    public AuthenicationResponse() {
    }

    public AuthenicationResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
