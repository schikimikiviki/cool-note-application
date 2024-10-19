package com.note.note.data;

import java.util.List;
import java.util.Set;

public class UserDto {

	private String username;
	private String password;
	private String fullname;
	private List<Note> notes;
	private Set<String> roles;

	public UserDto() {

	}

	public UserDto(String username, String password, String fullname, List<Note> notes, Set<String> roles) {
		super();
		this.username = username;
		this.password = password;
		this.fullname = fullname;
		this.notes = notes;
		this.roles = roles;
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
		return "UserDto [username=" + username + ", password=" + password + ", fullname=" + fullname + "]";
	}
}