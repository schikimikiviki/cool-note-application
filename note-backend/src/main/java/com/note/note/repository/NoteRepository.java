package com.note.note.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.note.note.data.Note;
import com.note.note.data.User;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {


	 
	List<Note> findByUserId(Long userId);

    
}
