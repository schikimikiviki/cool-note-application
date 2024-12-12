package com.note.note.service;

import java.util.List;
import java.util.Optional;

import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.data.UserDto;

public interface UserService {
 User findByUsername(String username);
 
 User findByID (Long Id);

 User save(UserDto userDto);
 
 List<User> findAllUsers();

Note addNoteToUser(Long userId, Note note);

Optional<User> findUserById (Long Id);
 



}