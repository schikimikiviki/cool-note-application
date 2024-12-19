package com.note.note;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.note.note.data.Color;
import com.note.note.data.ColorPalette;
import com.note.note.repository.ColorPaletteRepository;

import java.util.Arrays;
import java.util.List;

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
		 

        // Save palettes to the database
        colorPaletteRepository.save(palette1);
        colorPaletteRepository.save(palette2); 
        colorPaletteRepository.save(palette3);
		 

        System.out.println("Color palettes initialized.");
    }
}
