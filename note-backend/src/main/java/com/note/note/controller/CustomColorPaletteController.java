package com.note.note.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.note.note.data.ColorPalette;
import com.note.note.data.CustomColorPalette;
import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.data.UserDto;
import com.note.note.service.ColorPaletteService;
import com.note.note.service.CustomColorPaletteService;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/colorpalettes/custom")
public class CustomColorPaletteController {

	@Autowired
	private CustomColorPaletteService customColorPaletteService;

	@Autowired
	private UserDetailsService userDetailsService;

	@GetMapping("/")
	public List<CustomColorPalette> getAllCustomColorPalettes() {
		return customColorPaletteService.findAll();
	}

    @PostMapping("/add")
    public CustomColorPalette createCustomColorPalette(@RequestBody CustomColorPalette customColorPalette) {
		
    	CustomColorPalette palette = customColorPaletteService.save(customColorPalette);
        return palette;

    }

    @DeleteMapping("/{id}")
    public void deleteCustomPaletteById(@PathVariable Long id) {
        customColorPaletteService.deleteById(id);
    }
	 

}
