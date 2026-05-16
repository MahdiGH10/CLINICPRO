package com.ClinicPRO.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClinicPRO.dto.AuthRequest;
import com.ClinicPRO.dto.AuthResponse;
import com.ClinicPRO.dto.ChangePasswordRequest;
import com.ClinicPRO.dto.CreateMedecinRequest;
import com.ClinicPRO.dto.MeResponse;
import com.ClinicPRO.dto.RegisterPatientRequest;
import com.ClinicPRO.dto.UserCreationResponse;
import com.ClinicPRO.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authSER;

	@GetMapping("/me")
	public MeResponse profilCourant(Principal principal) {
		return authSER.profilCourant(principal.getName());
	}

	@PostMapping("/login")
	public AuthResponse seConnecter(@Valid @RequestBody AuthRequest request) {
		return authSER.seConnecter(request);
	}

	@PostMapping("/change-password")
	public AuthResponse changerMotDePasse(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
		return authSER.changerMotDePasse(principal.getName(), request);
	}

	@PostMapping("/register")
	public AuthResponse inscrirePatient(@Valid @RequestBody RegisterPatientRequest request) {
		return authSER.inscrirePatient(request);
	}

	@PostMapping("/admin/medecins")
	@PreAuthorize("hasRole('ADMIN')")
	public UserCreationResponse creerMedecin(@Valid @RequestBody CreateMedecinRequest request) {
		return authSER.creerMedecin(request);
	}
}
