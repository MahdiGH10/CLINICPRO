package com.ClinicPRO.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ClinicPRO.entities.AppUser;
import com.ClinicPRO.repositories.AppUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private AppUserRepository auREP;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		AppUser appUser = auREP.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec cet email"));

		return org.springframework.security.core.userdetails.User
				.withUsername(appUser.getEmail())
				.password(appUser.getPassword())
				.disabled(!appUser.isEnabled())
				.roles(appUser.getRole().name())
				.build();
	}
}
