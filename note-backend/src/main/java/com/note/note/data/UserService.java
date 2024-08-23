package com.note.note.data;


public interface UserService {
 User findByUsername(String username);

 User save(UserDto userDto);

}