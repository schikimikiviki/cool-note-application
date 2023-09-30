package com.note.note.data;

import com.note.note.data.Note;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    Optional<Note> findByName(String name);
}
