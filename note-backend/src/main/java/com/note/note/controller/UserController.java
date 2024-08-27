
package com.note.note.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.User;
import com.note.note.data.UserDto;
import com.note.note.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("")
public class UserController {

 @Autowired
 private UserDetailsService userDetailsService;

 private final UserService userService;

 public UserController(UserService userService) {
  this.userService = userService;
 }

 @GetMapping("/home")
 public UserDetails getHome(Principal principal) {
  // Ensure principal is not null and return user details
  return userDetailsService.loadUserByUsername(principal.getName());
 }

 @GetMapping("/users")
 public List<User> getAllUsers() {
     // Return list of users from the database
     return userService.findAllUsers();
 }

 @PostMapping("/register")
 public User register(@RequestBody UserDto userDto) {
  User user = userService.findByUsername(userDto.getUsername());
  if (user != null) {
   // Handle user already exists case
   //throw new UserAlreadyExistsException("User already exists");
  }
  return userService.save(userDto);
 }
}
