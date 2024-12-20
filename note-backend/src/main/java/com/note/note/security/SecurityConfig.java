package com.note.note.security;

import java.beans.Customizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.note.note.data.CustomUserDetailsService;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        
				
        	.csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests((authz) -> authz
            		
            	.requestMatchers("/users/**").anonymous()
            	.requestMatchers("{userId}/notes").anonymous()
            	.requestMatchers("/api/notes/**").anonymous()
            	.requestMatchers("/api/notes/user/**").anonymous()
            	.requestMatchers("/register").anonymous()
            	.requestMatchers("/verify").anonymous()
            	.requestMatchers("/test").anonymous()
            	.requestMatchers("/home").anonymous()
				.requestMatchers("/login/**").anonymous() 
				.requestMatchers("/api/colorpalettes/**").anonymous() 
                
                .anyRequest().authenticated()
                
                
            );
        
        return http.build();
    }

	

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
    }
}
