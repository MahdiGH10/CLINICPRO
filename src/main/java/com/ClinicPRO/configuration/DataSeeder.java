package com.ClinicPRO.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ClinicPRO.entities.AppUser;
import com.ClinicPRO.entities.Role;
import com.ClinicPRO.repositories.AppUserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

	@Autowired
	private AppUserRepository auREP;

	@Autowired
	private PasswordEncoder passwordEncoder;

	/* Mot de passe lu depuis application.properties : app.admin.password=Admin123!
	   Valeur par défaut si la propriété n'est pas définie */
	@Value("${app.admin.email:admin@clinicpro.local}")
	private String adminEmail;

	@Value("${app.admin.password:Admin123!}")
	private String adminPassword;

	@Override
	public void run(String... args) {
		if (!auREP.existsByEmail(adminEmail)) {
			AppUser admin = new AppUser();
			admin.setEmail(adminEmail);
			admin.setPassword(passwordEncoder.encode(adminPassword));
			admin.setRole(Role.ADMIN);
			admin.setEnabled(true);
			auREP.save(admin);
		}
	}
}
