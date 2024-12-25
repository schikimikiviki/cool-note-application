package com.note.note.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.note.note.data.ColorPalette;
import com.note.note.data.User;
import com.note.note.repository.ColorPaletteRepository;
import com.note.note.repository.UserRepository;


@Service
public class ColorPaletteService {

private final ColorPaletteRepository colorPaletteRepository; 
private final UserRepository userRepository; 

    public ColorPaletteService(ColorPaletteRepository colorPaletteRepository, UserRepository userRepository) {
        this.colorPaletteRepository = colorPaletteRepository;
        this.userRepository = userRepository; 
     
    }

    public Optional<ColorPalette> findPalettesById(Long id) {
        
        return colorPaletteRepository.findById(id);
    }
    
    public List<ColorPalette> findAllPalettes(){
    	return colorPaletteRepository.findAll();
    }

	public ColorPalette save(ColorPalette existingPalette) {
		return colorPaletteRepository.save(existingPalette);
		
	}
	
	

    
	
}
