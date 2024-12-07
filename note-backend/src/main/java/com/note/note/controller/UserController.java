
package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.CustomUserDetailsService;
import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.data.UserDto;
import com.note.note.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
public class UserController {

 @Autowired
 private UserDetailsService userDetailsService;
 
 private final PasswordEncoder passwordEncoder; 

 private final UserService userService;
 
 private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);


 public UserController(UserService userService, PasswordEncoder passwordEncoder) {
  this.passwordEncoder = passwordEncoder;
  this.userService = userService;
 }

 @GetMapping("/home")
 public UserDetails getHome(Principal principal) {
  // Ensure principal is not null and return user details
  return userDetailsService.loadUserByUsername(principal.getName());
 }
 
 @GetMapping("/test")
 public ResponseEntity<String> testLogging() {
	 System.out.println("testtt");
     logger.info("Test endpoint called");
     return ResponseEntity.ok("Test successful");
 }


 @GetMapping("/users")
 public List<User> getAllUsers() {
     // Return list of users from the database
     return userService.findAllUsers();
 }
 
 @GetMapping("/users/{userName}")
 public User getUserData(@PathVariable String userName) {
     // Return details of a single user
     return userService.findByUsername(userName);
 }
 
 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestParam Map<String, String> loginData) {
     String username = loginData.get("username");
     String password = loginData.get("password");

     // Load user details by username
     UserDetails userDetails = userDetailsService.loadUserByUsername(username);

     if (userDetails != null && passwordEncoder.matches(password, userDetails.getPassword())) {
         // Login successful
         return ResponseEntity.ok(Map.of("success", true, "message", "Login successful"));
     } else {
         // Invalid credentials
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid credentials"));
     }
 }


 
 @PostMapping("/register")
 public ResponseEntity<?> register(@RequestBody UserDto userDto) {
     User existingUser = userService.findByUsername(userDto.getUsername());
     if (existingUser != null) {
         return ResponseEntity
                 .status(HttpStatus.CONFLICT)
                 .body(Map.of("success", false, "message", "User already exists"));
     }
     User newUser = userService.save(userDto);
     return ResponseEntity
             .status(HttpStatus.CREATED)
             .body(Map.of("success", true, "user", newUser));
 }


}
