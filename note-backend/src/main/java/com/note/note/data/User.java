package com.note.note.data;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 private Long id;
 // @Column(unique = true)
 private String username;
 private String password;
 private String fullname;
 private String email; 
 private Boolean isAuthActive;
 private List<String> loginList; 
 
 @Enumerated(EnumType.STRING)
 private Theme theme;
 
 @Enumerated(EnumType.STRING)
 private FontSize fontSize; 

 
 @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
 private List<Note> notes;
 
 
 private Set<String> roles;


 public User() {

 }

 public User(Long id, String username, String password, String fullname, List<Note> notes, Set<String> roles, String email, Boolean isAuthActive, List<String> loginList, Theme theme, FontSize fontSize) {
  super();
  this.id = id; 
  this.username = username;
  this.password = password;
  this.fullname = fullname;
  this.notes = notes; 
  this.roles = roles; 
  this.email = email; 
  this.isAuthActive = isAuthActive; 
  this.loginList = loginList; 
  this.theme = theme; 
  this.fontSize = fontSize; 
 }
 
 public void setFontSize(FontSize fontSize) {
	 this.fontSize = fontSize; 
 }
 
 public FontSize getFontSize() {
	 return fontSize; 
 }
 
 public void setTheme (Theme theme) {
	 this.theme = theme; 
 }
 
 public Theme getTheme() {
	 return theme; 
 }
 
 public void setLoginList (List<String> loginList) {
	 this.loginList = loginList;
 }
 
 public List<String> getLoginList () {
	 return loginList; 
 }
 
 public void setIsAuthActive(Boolean isAuthActive) {
	 this.isAuthActive = isAuthActive; 
 }
 
 public Boolean getIsAuthActive() {
	 return isAuthActive; 
 }
 
 public String getEmail() {
	 return email; 
 }

 public void setEmail(String email) {
	 this.email = email; 
 }
 
 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getUsername() {
  return username;
 }

 public void setUsername(String username) {
  this.username = username;
 }

 public String getPassword() {
  return password;
 }

 public void setPassword(String password) {
  this.password = password;
 }

 public String getFullname() {
  return fullname;
 }

 public void setFullname(String fullname) {
  this.fullname = fullname;
 }
 
 public List<Note> getNotes() {
     return notes;
 }

 
 public void setNotes(List<Note> notes) {
     this.notes = notes;
     for (Note note : notes) {
         note.setUser(this);  // Ensure the bidirectional relationship is set
     }
 }
 
 public Set<String> getRoles() {
     return roles;
 }

 public void setRoles(Set<String> roles) {
     this.roles = roles;
 }
 
 

 @Override
 public String toString() {
  return "User [id=" + id + ", username=" + username + ", password=" + password + ", fullname=" + fullname + ", email=" + email + "]";
 }

}