package com.note.note.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.Note;
import com.note.note.data.NoteDto;
import com.note.note.service.NoteService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserDetailsService userDetailsService;

    @GetMapping
    public List<Note> getNotesForUser(Principal principal) {
        return noteService.findNotesByUser(principal.getName());
    }

    @PostMapping
    public Note createNote(@RequestBody NoteDto noteDto, Principal principal) {
        return noteService.saveNoteForUser(principal.getName(), noteDto.getTitle(), noteDto.getContent());
    }

    @DeleteMapping("/{id}")
    public void deleteNoteById(@PathVariable Long id) {
        noteService.deleteNoteById(id);
    }
}
