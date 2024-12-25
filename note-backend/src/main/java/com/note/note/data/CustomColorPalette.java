package com.note.note.data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class CustomColorPalette {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @ElementCollection
    private List<String> userSetColors;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public CustomColorPalette() {

    }

    public CustomColorPalette(Long id, String name, List<String> userSetColors, User user) {
     super();
     this.id = id; 
     this.name = name;
     this.userSetColors = userSetColors;
     this.user = user; 
    }
    
    public User getUser() {
    	return user; 
    }
    
    public void setUser (User user) {
    	this.user = user; 
    }
    
    public List<String> getUserSetColors() {
        return userSetColors;
    }

    public void setUserSetColors(List<String> userSetColors) {
        this.userSetColors = userSetColors;
    }

    
    public void setId(Long id) {
    	this.id = id; 
    }
    
    public Long getId() {
    	return id; 
    }
    
    public String getName () {
    	return name; 
    }
    
    public void setName (String name) {
	   this.name = name; 
    }
}
