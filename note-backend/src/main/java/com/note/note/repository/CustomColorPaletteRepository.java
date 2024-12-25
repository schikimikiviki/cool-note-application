package com.note.note.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.note.note.data.CustomColorPalette;

public interface CustomColorPaletteRepository extends JpaRepository<CustomColorPalette, Long> {

	  Optional<CustomColorPalette> findByName(String name);
	
	  
}
