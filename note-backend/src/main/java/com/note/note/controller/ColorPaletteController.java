package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.ColorPalette;
import com.note.note.service.ColorPaletteService;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/colorpalettes")
public class ColorPaletteController {

	@Autowired
	private ColorPaletteService colorPaletteService;

	@Autowired
	private UserDetailsService userDetailsService;

	

	@GetMapping("/")
	public List<ColorPalette> getAllColorPalettes() {
		return colorPaletteService.findAllPalettes();
	}

	/*
	 * @PostMapping("/{userId}") public Note createNote(@PathVariable Long
	 * userId, @RequestBody Note note) {
	 * 
	 * return noteService.saveNoteForUser(userId, note); Note savedNote =
	 * userService.addNoteToUser(userId, note); return savedNote;
	 * 
	 * }
	 */

}
