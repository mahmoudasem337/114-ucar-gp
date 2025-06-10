package com.graduationproject.asem.Auth;

import com.graduationproject.asem.User.User;
import com.graduationproject.asem.User.UserRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class PasswordController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final OTPService otpService;
    private final PasswordEncoder passwordEncoder;
    public PasswordController(UserRepository userRepository, EmailService emailService, OTPService otpService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
    }

        @PostMapping("/forgot-password")
        public String forgotPassword(@RequestParam String email) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String otp = otpService.generateOtp();
            otpService.saveOtp(email, otp); // Save OTP in cache
            emailService.sendOtpEmail(user.getEmail(), otp);
            return "OTP sent to your email.";
        }

        @PostMapping("/reset-password")
        public String resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String cachedOtp = otpService.getOtp(email); // Retrieve OTP from cache
            if (cachedOtp == null || !cachedOtp.equals(otp)) {
                throw new RuntimeException("Invalid OTP");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password reset successfully.";
        }
}

