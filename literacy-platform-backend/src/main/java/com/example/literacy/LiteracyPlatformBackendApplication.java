package com.example.literacy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LiteracyPlatformBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LiteracyPlatformBackendApplication.class, args);
    }
}
