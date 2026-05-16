package com.ClinicPRO.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.dto.AuthRequest;
import com.ClinicPRO.dto.AuthResponse;
import com.ClinicPRO.dto.ChangePasswordRequest;
import com.ClinicPRO.dto.CreateMedecinRequest;
import com.ClinicPRO.dto.MeResponse;
import com.ClinicPRO.dto.RegisterPatientRequest;
import com.ClinicPRO.dto.UserCreationResponse;
import com.ClinicPRO.entities.AppUser;
import com.ClinicPRO.entities.Medecin;
import com.ClinicPRO.entities.Patient;
import com.ClinicPRO.entities.Role;
import com.ClinicPRO.repositories.AppUserRepository;
import com.ClinicPRO.repositories.MedecinRepository;
import com.ClinicPRO.repositories.PatientRepository;

@Service
public class AuthService {

	@Autowired
	private AppUserRepository auREP;

	@Autowired
	private PatientRepository pREP;

	@Autowired
	private MedecinRepository mREP;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JwtService jwtSER;

	public AuthResponse seConnecter(AuthRequest request) {
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		AppUser user = auREP.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

		String token = jwtSER.genererToken(user);
		return new AuthResponse(token, user.getEmail(), user.getRole().name(), "Connexion réussie",
				user.isMustChangePassword());
	}

	public AuthResponse inscrirePatient(RegisterPatientRequest request) {
		verifierEmailDisponible(request.getEmail());

		Patient patient = new Patient();
		patient.setNom(request.getNom());
		patient.setDateNaissance(request.getDateNaissance());
		patient.setTel(request.getTel());
		patient.setEmail(request.getEmail());
		patient.setDossierMedical("");
		patient = pREP.save(patient);

		AppUser user = new AppUser();
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(Role.PATIENT);
		user.setEnabled(true);
		user.setMustChangePassword(false);
		user.setPatient(patient);
		patient.setAppUser(user);
		auREP.save(user);

		String token = jwtSER.genererToken(user);
		return new AuthResponse(token, user.getEmail(), user.getRole().name(), "Compte patient créé avec succès",
				false);
	}

	public UserCreationResponse creerMedecin(CreateMedecinRequest request) {
		verifierEmailDisponible(request.getEmail());

		Medecin medecin = new Medecin();
		medecin.setNom(request.getNom());
		medecin.setSpecialite(request.getSpecialite());
		medecin.setDisponibilite(request.getDisponibilite());
		medecin.setEmail(request.getEmail());
		medecin = mREP.save(medecin);

		AppUser user = new AppUser();
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(Role.MEDECIN);
		user.setEnabled(true);
		user.setMustChangePassword(true);
		user.setMedecin(medecin);
		medecin.setAppUser(user);
		auREP.save(user);

		return new UserCreationResponse(
				"Compte médecin créé avec succès",
				user.getEmail(),
				user.getRole().name(),
				request.getPassword());
	}

	@Transactional
	public AuthResponse changerMotDePasse(String email, ChangePasswordRequest request) {
		AppUser user = auREP.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));

		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(email, request.getCurrentPassword()));

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setMustChangePassword(false);
		saveUser(user);

		String token = jwtSER.genererToken(user);
		return new AuthResponse(token, user.getEmail(), user.getRole().name(), "Mot de passe modifié avec succès",
				false);
	}

	private void saveUser(AppUser user) {
		aREP.save(user);
	}

	@Transactional(readOnly = true)
	public MeResponse profilCourant(String email) {
		AppUser user = auREP.findByEmail(email)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable"));

		Integer idPatient = user.getPatient() != null ? user.getPatient().getIdPatient() : null;
		Integer idMedecin = user.getMedecin() != null ? user.getMedecin().getIdMedecin() : null;

		// Use direct repository lookup by email to avoid expensive full-table scans
		if (idMedecin == null && user.getRole() == Role.MEDECIN) {
			idMedecin = mREP.findByEmail(email).map(Medecin::getIdMedecin).orElse(null);
		}

		if (idPatient == null && user.getRole() == Role.PATIENT) {
			idPatient = pREP.findByEmail(email).map(Patient::getIdPatient).orElse(null);
		}

		return new MeResponse(user.getEmail(), user.getRole().name(), idPatient, idMedecin);
	}

	private void verifierEmailDisponible(String email) {
		if (auREP.existsByEmail(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
		}
	}
}
