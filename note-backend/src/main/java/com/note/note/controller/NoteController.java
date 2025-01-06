package com.note.note.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.note.note.data.Note;
import com.note.note.service.NoteService;
import com.note.note.service.UserService;

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

		Note savedNote = userService.addNoteToUser(userId, note);
		return savedNote;

	}

	@PatchMapping("/{noteId}")
	public Note editNote(@PathVariable Long noteId, @RequestBody Note note) {

		// Find the note to edit
		Optional<Note> foundNoteOptional = noteService.findNoteById(noteId);

		if (foundNoteOptional.isPresent()) {
			Note foundNote = foundNoteOptional.get();

			// Only update fields that are not null
			if (note.getTitle() != null) {
				foundNote.setTitle(note.getTitle());
			}
			if (note.getContent() != null) {
				foundNote.setContent(note.getContent());
			}

			if (note.getIsDone() != null) {
				foundNote.setIsDone(note.getIsDone());
			}

			if (note.getColorString() != null) {
				foundNote.setColorString(note.getColorString());
			}

			if (note.getFontColor() != null) {
				foundNote.setFontColor(note.getFontColor());
			}
			
			if (note.getDueDate() != null) {
				foundNote.setDueDate(note.getDueDate());
			}

			// Save updated note
			return noteService.save(foundNote);
		}

		// If the note isn't found, return null or throw an exception
		return null;
	}

	@DeleteMapping("/{id}")
	public void deleteNoteById(@PathVariable Long id) {
		noteService.deleteNoteById(id);
	}
}
