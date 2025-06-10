package com.graduationproject.asem.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Optional<User> findByEmail(String Email) {
        Optional<User> user =userRepository.findByEmail(Email);
        return user;
    }
    public Optional<User> findById(Long Id) {
        Optional<User> user =userRepository.findById(Id);
        return user;
    }
    public void save(User user) {
        userRepository.save(user);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public void deleteUserAccount(Long id) {
        userRepository.deleteById(id);
    }
}
