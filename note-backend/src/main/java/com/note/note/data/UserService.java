package com.note.note.data;

import java.util.List;

public interface UserService {
 User findByUsername(String username);

 User save(UserDto userDto);
 
 List<User> findAllUsers();

}