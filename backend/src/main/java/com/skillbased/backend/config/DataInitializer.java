package com.skillbased.backend.config;

import com.skillbased.backend.entity.User;
import com.skillbased.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // 1. Create Admin
            if (userRepository.findByEmail("admin@skillbased.com").isEmpty()) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@skillbased.com");
                admin.setPassword("admin123");
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created: admin@skillbased.com / admin123");
            }

            // 2. Create Client
            if (userRepository.findByEmail("client@skillbased.com").isEmpty()) {
                User client = new User();
                client.setName("Demo Client");
                client.setEmail("client@skillbased.com");
                client.setPassword("client123");
                client.setRole(User.Role.CLIENT);
                userRepository.save(client);
                System.out.println("Client user created: client@skillbased.com / client123");
            }

            // 3. Create Student
            if (userRepository.findByEmail("student@skillbased.com").isEmpty()) {
                User student = new User();
                student.setName("Demo Student");
                student.setEmail("student@skillbased.com");
                student.setPassword("student123");
                student.setRole(User.Role.STUDENT);
                userRepository.save(student);
                System.out.println("Student user created: student@skillbased.com / student123");
            }
        };
    }
}
