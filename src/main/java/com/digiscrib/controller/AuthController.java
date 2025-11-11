package com.digiscrib.controller;

import com.digiscrib.dto.*;
import com.digiscrib.entity.User;
import com.digiscrib.service.UserService;
import com.digiscrib.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user.getUsername());
            
            userService.updateLastLogin(user.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), "Login successful"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, "Invalid credentials"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                "USER"
            );
            
            String token = jwtUtil.generateToken(user.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), "Registration successful"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, e.getMessage()));
        }
    }
}