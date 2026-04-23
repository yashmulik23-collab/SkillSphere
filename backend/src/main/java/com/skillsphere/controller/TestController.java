package com.skillsphere.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping
    public String test() {
        return "Backend is reachable and public!";
    }
}
