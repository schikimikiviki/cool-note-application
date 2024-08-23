package com.note.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.note.note.data.User;
import com.note.note.data.UserDto;



public interface UserRepository extends JpaRepository<User, Long> {

 User findByUsername(String username);

 User save(UserDto userDto);

 List<User> findAll();
}
