package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.CustomUserDetailsService;
import com.note.note.data.Note;
import com.note.note.data.NoteDto;
import com.note.note.service.NoteService;
import com.note.note.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserDetailsService userDetailsService;
    
    private final UserService userService;
   

    public NoteController(UserService userService) {
     this.userService = userService;
    }

    
    @GetMapping("/user/{userId}")
    public List<Note> getNotesForUser(@PathVariable Long userId) {
        return noteService.getNotesByUserId(userId);
    }
    
    

    @PostMapping("/{userId}")
    public Note createNote(@PathVariable Long userId, @RequestBody Note note) {
 
		/* return noteService.saveNoteForUser(userId, note); */
    	Note savedNote = userService.addNoteToUser(userId, note);
        return savedNote;

    }
    
    @PatchMapping("/{noteId}")
    public Note editNote(@PathVariable Long noteId, @RequestBody Note note) {
    	 
	// find the right note to edit
    Optional<Note> foundNoteOptional = noteService.findNoteById(noteId);
    
    if (foundNoteOptional.isPresent()) {
        Note foundNote = foundNoteOptional.get();
        
        foundNote.setTitle(note.getTitle());
        foundNote.setContent(note.getContent());
        //TODO: add color
        // Save updated note
        Note updatedNote = noteService.save(foundNote);

        return updatedNote;
    } else {
        return null; 
    }

    }

    @DeleteMapping("/{id}")
    public void deleteNoteById(@PathVariable Long id) {
        noteService.deleteNoteById(id);
    }
}
