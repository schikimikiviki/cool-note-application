
package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.CustomUserDetailsService;
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

 private final UserService userService;
 
 private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);


 public UserController(UserService userService) {
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

	/*
	 * @PostMapping("/register") public User register(@RequestBody UserDto userDto)
	 * { User user = userService.findByUsername(userDto.getUsername()); if (user !=
	 * null) { // Handle user already exists case //throw new
	 * UserAlreadyExistsException("User already exists"); } return
	 * userService.save(userDto); }
	 */
 
	/*
	 * @PostMapping("/register") public ResponseEntity<?> register(@RequestBody
	 * UserDto userDto) { User existingUser =
	 * userService.findByUsername(userDto.getUsername()); if (existingUser != null)
	 * { // Handle user already exists case return ResponseEntity
	 * .status(HttpStatus.CONFLICT) // Return a 409 Conflict status
	 * .body("User already exists"); } User newUser = userService.save(userDto);
	 * return ResponseEntity .status(HttpStatus.CREATED) // Return a 201 Created
	 * status .body(newUser); }
	 */
 
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
