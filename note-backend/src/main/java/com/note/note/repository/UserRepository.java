package com.note.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.note.note.data.ColorPalette;
import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.data.UserDto;

import jakarta.transaction.Transactional;



public interface UserRepository extends JpaRepository<User, Long> {

 User findByUsername(String username);

 User save(UserDto userDto);

 List<User> findAll();
 
 List<User> findByColorPalette(ColorPalette colorPalette);
 
 List<User> findByColorPaletteId(Long colorPaletteId);
 
 
 
}
