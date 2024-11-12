package com.note.note.service;

import org.springframework.stereotype.Service;

import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.repository.NoteRepository;
import com.note.note.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserService userService;
    private final UserRepository userRepository; 

    public NoteService(NoteRepository noteRepository, UserService userService, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userService = userService;
        this.userRepository = userRepository; 
    }

    public List<Note> findNotesByUser(Long userID) {
        
        return noteRepository.findByUserId(userID);
    }
    
    public Note saveNoteForUser(Long userId, Note note) {
        User user = userRepository.findById(userId)
                                  .orElseThrow();

        // Set the user for this note
        note.setUser(user);

        // Save the note with the user associated
        return noteRepository.save(note);
    }
    
    public Note save(Note note) {
    	return noteRepository.save(note);
    }
    
    public Optional<Note> findNoteById (Long id) {
    	return noteRepository.findById(id);
    }

    public void deleteNoteById(Long id) {
        noteRepository.deleteById(id);
    }

    public List<Note> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }
    
   

	
}
