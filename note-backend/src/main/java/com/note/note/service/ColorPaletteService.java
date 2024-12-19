package com.note.note.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.note.note.data.ColorPalette;
import com.note.note.repository.ColorPaletteRepository;


@Service
public class ColorPaletteService {

private final ColorPaletteRepository colorPaletteRepository; 

    public ColorPaletteService(ColorPaletteRepository colorPaletteRepository) {
        this.colorPaletteRepository = colorPaletteRepository;
     
    }

    public Optional<ColorPalette> findPalettesById(Long id) {
        
        return colorPaletteRepository.findById(id);
    }
    
	
}
