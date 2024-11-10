package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.CustomUserDetailsService;
import com.note.note.data.Note;
import com.note.note.data.NoteDto;
import com.note.note.service.NoteService;
import com.note.note.service.UserService;

import java.security.Principal;
import java.util.List;

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

    @DeleteMapping("/{id}")
    public void deleteNoteById(@PathVariable Long id) {
        noteService.deleteNoteById(id);
    }
}
