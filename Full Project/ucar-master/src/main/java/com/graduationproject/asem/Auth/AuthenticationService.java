package com.graduationproject.asem.Auth;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.graduationproject.asem.Config.JwtUtils;
import com.graduationproject.asem.User.Role;
import com.graduationproject.asem.User.User;
import com.graduationproject.asem.User.UserRepository;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }
    public AuthenicationResponse register(RegisterRequest request) {
        AuthenicationResponse response = new AuthenicationResponse();
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhonenumber(request.getPhonenumber());
        user.setRole(Role.ROLE_USER);
        repository.save(user);
        var jwtToken = jwtUtils.generateToken(request.getEmail());
        response.setToken(jwtToken);
        return response;
    }

    public AuthenicationResponse authenticate(AuthenticationRequest request) {
        AuthenicationResponse response = new AuthenicationResponse();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtUtils.generateToken(request.getEmail());
        response.setToken(jwtToken);
        return response;
    }

    public Optional<UserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return Optional.of((UserDetails) authentication.getPrincipal());
        }
        return Optional.empty();
    }
}
