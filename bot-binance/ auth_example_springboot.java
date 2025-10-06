// auth_example_springboot.java
// Enhanced Spring Boot authentication: registration, login, JWT, TOTP 2FA, protected endpoint

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import dev.turingcomplete.javaotp.Totp;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class AuthExampleSpringBoot {
    static class User {
        String email;
        String passwordHash;
        String totpSecret;
        User(String email, String passwordHash) {
            this.email = email;
            this.passwordHash = passwordHash;
        }
    }

    private Map<String, User> users = new ConcurrentHashMap<>();
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private String jwtSecret = "supersecretkey";

    public static void main(String[] args) {
        SpringApplication.run(AuthExampleSpringBoot.class, args);
    }

    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> body) {
