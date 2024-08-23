package com.note.note.service;

import org.springframework.stereotype.Service;

import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.repository.NoteRepository;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserService userService;

    public NoteService(NoteRepository noteRepository, UserService userService) {
        this.noteRepository = noteRepository;
        this.userService = userService;
    }

    public List<Note> findNotesByUser(String username) {
        User user = userService.findByUsername(username);
        return noteRepository.findByUser(user);
    }

    public Note saveNoteForUser(String username, String title, String content) {
        User user = userService.findByUsername(username);
        Note note = new Note(title, content, user);
        return noteRepository.save(note);
    }

    public void deleteNoteById(Long id) {
        noteRepository.deleteById(id);
    }
}
