package com.note.note.data;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private String username;
    private String password;
    private List<? extends GrantedAuthority> authorities;
    private List<Note> notes; // Custom field for notes

    // Constructor
    public CustomUserDetails(String username, String password, 
                             List<? extends GrantedAuthority> authorities, 
                             List<Note> notes) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.notes = notes;
    }

    // Custom getter for notes
    public List<Note> getNotes() {
        return notes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
