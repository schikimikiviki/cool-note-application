package com.note.note.data;

import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ColorPalette {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Color> colorList; 


    public ColorPalette() {

    }

    public ColorPalette(Long id, String name, List<Color> colorList) {
     super();
     this.id = id; 
     this.name = name;
     this.colorList = colorList; 
    }
    
    public void setId(Long id) {
    	this.id = id; 
    }
    
    public Long getId() {
    	return id; 
    }
    
    public void setColorList(List<Color> colorList) {
    	this.colorList = colorList; 
    }
    
    public List<Color> getColorList(){
    	return colorList; 
    }
    
    public String getName () {
    	return name; 
    }
    
    public void setName (String name) {
	   this.name = name; 
    }
}
