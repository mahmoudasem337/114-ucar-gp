package com.graduationproject.asem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AsemApplication {
	public static void main(String[] args) {
		SpringApplication.run(AsemApplication.class, args);
	}
}
