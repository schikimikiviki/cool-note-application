package com.note.note.data;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "note")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)  // Allows storing large text data
    private String content;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Constructors, getters and setters

    public Note() {
        this.createdAt = LocalDateTime.now();
    }

    public Note(Long id, String title, String content, User user) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.id = id; 
        this.createdAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
    	return this.createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
    	this.createdAt = createdAt; 
    }
    
    public Long  getId() {
    	return this.id;
    }
    
    public void setId(Long id) {
    	this.id = id;  
    }
    
    public User getUser () {
    	return this.user; 
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getTitle () {
    	return this.title; 
    }
    
    public void setTile(String title) {
    	this.title = title; 
    }
    
    public String getContent () {
    	return this.content; 
    }
    
    public void setContent (String content) {
    	this.content = content; 
    }
    
    
    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                ", user=" + user.getUsername() + 
                '}';
    }


   
}
