package com.note.note.data;

import java.util.List;
import java.util.Set;

public class UserDto {

	private String username;
	private String password;
	private String fullname;
	private List<Note> notes;
	private Set<String> roles;
	private Long id;
	private String email; 
	private Boolean isAuthActive;


	public UserDto() {

	}

	public UserDto(Long id, String username, String password, String fullname, List<Note> notes, Set<String> roles, String email, Boolean isAuthActive) {
		super();
		this.id = id; 
		this.username = username;
		this.password = password;
		this.fullname = fullname;
		this.notes = notes;
		this.roles = roles;
		this.email = email; 
		this.isAuthActive = isAuthActive; 
	}
	
	public Boolean getIsAuthActive() {
		return isAuthActive; 
	}
	
	public void setIsAuthActive(Boolean isAuthActive) {
		this.isAuthActive = isAuthActive; 
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
	
	public void setIdLong(Long id) {
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
	}

	public Set<String> getRoles() {
		return roles;
	}

	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return "UserDto [username=" + username + ", password=" + password + ", fullname=" + fullname + ", email=" + email + "]";
	}
}