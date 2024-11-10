package com.note.note.data;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.note.note.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private UserRepository userRepository;

	private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

	public CustomUserDetailsService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

	
		logger.info("Attempting to load user by username: {}", username);
		User user = userRepository.findByUsername(username);
		if (user == null) {
			logger.warn("User not found: {}", username);
			throw new UsernameNotFoundException("Username or Password not found");

		}

		logger.info("Loading user: {}", username);

		var authorities = user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role))
				.collect(Collectors.toList());

		logger.info("Authorities: ", authorities);

		return new CustomUserDetails(user.getUsername(), user.getPassword(), authorities, user.getNotes());
	}

	public Collection<? extends GrantedAuthority> authorities() {
		return Arrays.asList(new SimpleGrantedAuthority("USER"));
	}

}