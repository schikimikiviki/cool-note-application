package com.note.note.data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class ColorPalette {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Color> colorList; 
    
    
    @OneToMany(mappedBy = "colorPalette", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<User> users; 
    

    public ColorPalette() {

    }

    public ColorPalette(Long id, String name, List<Color> colorList, List<User> users) {
     super();
     this.id = id; 
     this.name = name;
     this.colorList = colorList; 
     this.users = users; 
    }
    
    public void setUsers(List<User> users) {
    	this.users = users; 
    }
    
    public List<User> getUsers(){
    	return users; 
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
