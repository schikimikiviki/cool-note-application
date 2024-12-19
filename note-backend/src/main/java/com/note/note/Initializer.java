package com.note.note;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.note.note.data.Color;
import com.note.note.data.ColorPalette;
import com.note.note.repository.ColorPaletteRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class Initializer implements CommandLineRunner {

    private ColorPaletteRepository colorPaletteRepository = null;

    public Initializer(ColorPaletteRepository colorPaletteRepository) {
        this.colorPaletteRepository = colorPaletteRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Define palettes
        ColorPalette palette1 = new ColorPalette(null, "Default", Arrays.asList(Color.RED, Color.YELLOW, Color.PURPLE,  Color.GREEN, Color.BLUE));
		ColorPalette palette2 = new ColorPalette(null, "Pastel", Arrays.asList(Color.COTTONCANDY,  Color.LAVENDER, Color.MAGNOLIA, Color.MEDIUMBLUE, Color.SKY)); 
		ColorPalette palette3 = new ColorPalette(null, "Autumn",Arrays.asList(Color.MOSS, Color.OGRE, Color.BEIGE, Color.CREME, Color.PUMPKIN));
		ColorPalette palette4 = new ColorPalette(null, "Summer", Arrays.asList(Color.MARINE, Color.FUCHSIA, Color.EGG, Color.TURQUOISE, Color.WHITE ));
		ColorPalette palette5 = new ColorPalette(null, "Vintage", Arrays.asList(Color.BROWN, Color.GREENISH, Color.OCRE, Color.BRIGHT, Color.COOL));
		ColorPalette palette6 = new ColorPalette(null, "Neon", Arrays.asList(Color.NEON_GREEN, Color.NEON_ORANGE, Color.NEON_PINK, Color.NEON_PURPLE, Color.NEON_YELLOW));		
				
        // Save palettes to the database
		 saveIfNotExists(palette1);
	     saveIfNotExists(palette2);
	     saveIfNotExists(palette3);
	     saveIfNotExists(palette4);
	     saveIfNotExists(palette5);
	     saveIfNotExists(palette6);
		 

        System.out.println("Color palettes initialized.");
    }
    
    
    private void saveIfNotExists(ColorPalette colorPalette) {
        Optional<ColorPalette> existingPalette = colorPaletteRepository.findByName(colorPalette.getName());
        if (existingPalette.isEmpty()) {
            colorPaletteRepository.save(colorPalette);
            System.out.println("Palette " + colorPalette.getName() + " saved.");
        } else {
            System.out.println("Palette " + colorPalette.getName() + " already exists.");
        }
    }
}
