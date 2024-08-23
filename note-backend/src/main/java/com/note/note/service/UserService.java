package com.note.note.service;

import java.util.List;

import com.note.note.data.User;
import com.note.note.data.UserDto;

public interface UserService {
 User findByUsername(String username);

 User save(UserDto userDto);
 
 List<User> findAllUsers();

}