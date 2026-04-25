package com.skillsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class SkillSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillSphereApplication.class, args);
    }

    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("✅ DATABASE CONNECTED SUCCESSFULLY to Railway!");
            } catch (Exception e) {
                System.err.println("❌ DATABASE CONNECTION FAILED: " + e.getMessage());
            }
        };
    }
}
