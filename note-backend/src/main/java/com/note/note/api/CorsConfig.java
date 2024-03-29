package com.note.note.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    public CorsConfig() {
        System.out.println("CorsConfig loaded");
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/notes/**") // Add "/*" to allow any sub-paths
                .allowedOrigins("http://localhost:5173") // Specify the origin for your frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS",
                        "PATCH")
                // Specify all HTTP methods
                .allowCredentials(true);
    }

}
