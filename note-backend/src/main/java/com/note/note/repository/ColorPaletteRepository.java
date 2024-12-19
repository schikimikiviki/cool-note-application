package com.note.note.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.note.note.data.ColorPalette;

public interface ColorPaletteRepository extends JpaRepository<ColorPalette, Long> {

	  Optional<ColorPalette> findByName(String name);
	
	  
}
