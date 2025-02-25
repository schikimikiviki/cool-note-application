package com.note.note.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	 @Bean
	    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
	        return authConfig.getAuthenticationManager();
	    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http

		.csrf(csrf -> csrf.disable()).authorizeHttpRequests((authz) ->  authz
		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
		.requestMatchers("/users/check-username").permitAll() 
		.requestMatchers("/users/**").authenticated()
		.requestMatchers("{userId}/notes").authenticated()
		.requestMatchers("/api/notes/**").authenticated()
		.requestMatchers("/api/notes/user/**").authenticated()
		.requestMatchers("/register").permitAll()
		.requestMatchers("/verify").permitAll()
		.requestMatchers("/test").authenticated()
		.requestMatchers("/admin").hasRole("ADMIN")
		.requestMatchers(HttpMethod.POST,"/login").permitAll()
		.requestMatchers("/api/colorpalettes/**").authenticated()

		.anyRequest().authenticated())
		.httpBasic(Customizer.withDefaults());

		return http.build();
	}

	
	/*
	 * @Bean public UserDetailsService userDetailsService(PasswordEncoder
	 * passwordEncoder) { UserDetails admin = User.withUsername("admin")
	 * .password(passwordEncoder.encode("admin")) // Encode password .roles("USER",
	 * "ADMIN") .build();
	 * 
	 * UserDetails user = User.withUsername("user")
	 * .password(passwordEncoder.encode("user")) // Encode password .roles("USER")
	 * .build();
	 * 
	 * return new InMemoryUserDetailsManager(admin, user); }
	 */

	
}
