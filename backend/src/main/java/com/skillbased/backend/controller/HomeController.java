package com.skillbased.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5174")
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Backend is running successfully! Access APIs at /api/jobs or /api/auth";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Backend!";
    }
}
