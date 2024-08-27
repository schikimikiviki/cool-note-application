package com.note.note.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import java.net.http.*;
import java.net.URI;
import java.util.Map;

@RestController
public class CaptchaController {

    // Injecting the SITE_SECRET from application.properties
    @Value("${SITE_SECRET}")
    private String SITE_SECRET;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCaptcha(@RequestBody Map<String, String> body) {
        String captchaValue = body.get("captchaValue");
        System.out.println("CAPTCHA Value: " + captchaValue);
        System.out.println("SITE_SECRET: " + SITE_SECRET);

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://www.google.com/recaptcha/api/siteverify?secret=" + SITE_SECRET + "&response=" + captchaValue))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Log the full response from Google
            System.out.println("Google reCAPTCHA Response: " + response.body());

            return ResponseEntity.ok(response.body());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying captcha");
        }
    }

    
    
}
