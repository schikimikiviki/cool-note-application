package com.note.note.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.note.note.data.ColorPalette;
import com.note.note.data.CustomColorPalette;
import com.note.note.data.User;
import com.note.note.repository.ColorPaletteRepository;
import com.note.note.repository.CustomColorPaletteRepository;
import com.note.note.repository.UserRepository;


@Service
public class CustomColorPaletteService {

private final CustomColorPaletteRepository customColorPaletteRepository; 
private final UserRepository userRepository; 

    public CustomColorPaletteService(CustomColorPaletteRepository customColorPaletteRepository, UserRepository userRepository) {
        this.customColorPaletteRepository = customColorPaletteRepository;
        this.userRepository = userRepository; 
     
    }

    public Optional<CustomColorPalette> findCustomPalettesById(Long id) {
        
        return customColorPaletteRepository.findById(id);
    }
    
    public List<CustomColorPalette> findAllCustomPalettes(){
    	return customColorPaletteRepository.findAll();
    }

	public CustomColorPalette save(CustomColorPalette existingPalette) {
		return customColorPaletteRepository.save(existingPalette);
		
	}
	
	

    
	
}
