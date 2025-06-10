package com.graduationproject.asem.Auth;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OTPService {

    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    @CachePut(value = "otpCache", key = "#email")
    public String saveOtp(String email, String otp) {
        return otp; // Store OTP in cache
    }

    @Cacheable(value = "otpCache", key = "#email")
    public String getOtp(String email) {
        return null; // Return null if OTP is not found in cache
    }
}