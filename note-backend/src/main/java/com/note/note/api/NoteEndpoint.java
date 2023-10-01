package com.note.note.api;


import com.note.note.data.Note;
import com.note.note.data.NoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("notes")
public class NoteEndpoint {

    private final NoteRepository noteRepository;

    public NoteEndpoint(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    List<Note> findAll() {
        return noteRepository.findAll();
    }


    @GetMapping("/name/{name}")
    Note findByName(@PathVariable String name) throws NoteNotFoundExpection {
        return noteRepository.findByName(name).orElseThrow(NoteNotFoundExpection::new);
    }

    @PostMapping
    Note save(@RequestBody Note note) {
        return noteRepository.save(note);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable long id) {
        noteRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    Note update(@PathVariable Long id, @RequestBody Note updatedNote) throws NoteNotFoundExpection {
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(NoteNotFoundExpection::new);

        // Update the existing note with the data from updatedNote
        existingNote.setName(updatedNote.getName());
        existingNote.setContent(updatedNote.getContent());

        // Save the updated note
        return noteRepository.save(existingNote);
    }

}
