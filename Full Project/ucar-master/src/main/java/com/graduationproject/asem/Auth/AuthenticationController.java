package com.graduationproject.asem.Auth;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService service;
    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public AuthenicationResponse register(@RequestBody RegisterRequest request){
        return service.register(request);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/authenticate")
    public AuthenicationResponse authenticate(@RequestBody AuthenticationRequest request){
        return service.authenticate(request);
    }
}