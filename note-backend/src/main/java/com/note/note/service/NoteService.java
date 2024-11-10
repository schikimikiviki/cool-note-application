package com.note.note.service;

import org.springframework.stereotype.Service;

import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.repository.NoteRepository;
import com.note.note.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.util.List;

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


	/*
	 * @Transactional public Note saveNoteForUser(Long userId, String title, String
	 * content) { System.out.println("Saving with values:"+ userId+title+content);
	 * User user = userService.findByID(userId); if (user == null) { // or handle
	 * the error appropriately throw new RuntimeException("User not found with ID: "
	 * + userId); } else { System.out.println("User: " + user); } Note note = new
	 * Note(title, content, user); System.out.println("Note object: " +
	 * note.toString()); Note savedNote = noteRepository.save(note);
	 * System.out.println("Saved note: " + savedNote.toString()); return savedNote;
	 * }
	 */

    public void deleteNoteById(Long id) {
        noteRepository.deleteById(id);
    }

    public List<Note> getNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }
    
   

	
}
