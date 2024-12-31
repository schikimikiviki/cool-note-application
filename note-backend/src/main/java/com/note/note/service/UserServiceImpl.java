package com.note.note.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.note.note.data.Note;
import com.note.note.data.User;
import com.note.note.data.UserDto;
import com.note.note.repository.NoteRepository;
import com.note.note.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	PasswordEncoder passwordEncoder;

	private UserRepository userRepository;
	private NoteRepository noteRepository; 

	public UserServiceImpl(UserRepository userRepository, NoteRepository noteRepository) {
		super();
		this.userRepository = userRepository;
		this.noteRepository = noteRepository; 
	}

	@Override
	public User findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public User save(UserDto userDto) {

		User user = new User(userDto.getId(), userDto.getUsername(), userDto.getPassword(), userDto.getFullname(), userDto.getNotes(), userDto.getRoles(), userDto.getEmail(), userDto.getIsAuthActive(), userDto.getLoginList(), userDto.getTheme(), userDto.getFontSize(), userDto.getColorPalette(), userDto.getCustomColorPaletteList(), userDto.getFavoritePaletteReference(), userDto.getCustomPairs());

		return userRepository.save(user);
	}
	
	@Override
	public User findByID(Long ID) {
		return userRepository.getReferenceById(ID);

	}
	
	@Override
	  public Optional<User> findUserById (Long id) {
	    	return userRepository.findById(id);
	    }

	@Override
	public List<User> findAllUsers() {
		return userRepository.findAll();

	}
	
	public Note addNoteToUser(Long userId, Note note) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                                  .orElseThrow();

        // Set the user on the note
        note.setUser(user);

        // Save the note and return it
        return noteRepository.save(note);
    }
	
	
	
	@Override
	public void deleteUserById(Long id) {
	    if (userRepository.existsById(id)) { // Check if user exists
	        userRepository.deleteById(id);
	    } else {
	        throw new IllegalArgumentException("User with ID " + id + " does not exist");
	    }
	}


	


}