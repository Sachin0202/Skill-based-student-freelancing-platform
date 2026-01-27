package com.skillbased.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class SchemaFix {

    @Bean
    CommandLineRunner fixColumnLength(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("Applying database schema fix for 'status' column...");
                jdbcTemplate.execute("ALTER TABLE jobs MODIFY COLUMN status VARCHAR(20)");
                System.out.println("Schema fix applied successfully!");
            } catch (Exception e) {
                System.err.println("Note: Could not run ALTER TABLE automatically. " +
                        "This is likely fine if the column is already the correct size or if you are not using MySQL. "
                        +
                        "Error: " + e.getMessage());
            }
        };
    }
}
