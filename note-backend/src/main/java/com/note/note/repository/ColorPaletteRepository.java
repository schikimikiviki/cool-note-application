package com.note.note.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.note.note.data.ColorPalette;

public interface ColorPaletteRepository extends JpaRepository<ColorPalette, Long> {
}
