package com.ClinicPRO.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClinicPRO.dto.FactureDTO;
import com.ClinicPRO.mapper.FactureMapper;
import com.ClinicPRO.services.FactureService;

@RestController
@RequestMapping("/facture")
public class FactureController {

	@Autowired
	private FactureService fSER;

	@Autowired
	private FactureMapper factureMapper;

	@GetMapping("/toutes")
	@PreAuthorize("hasRole('ADMIN')")
	public List<FactureDTO> getToutesLesFactures() {
		return factureMapper.toListDTO(fSER.trouverToutesLesFactures());
	}

	@GetMapping("/mes")
	@PreAuthorize("hasRole('PATIENT')")
	public List<FactureDTO> getMesFactures(Authentication authentication) {
		return factureMapper.toListDTO(fSER.trouverFacturesDuPatientConnecte(authentication.getName()));
	}

	@GetMapping("/{idFacture}")
	@PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
	public FactureDTO getFactureParId(@PathVariable int idFacture, Authentication authentication) {
		boolean admin = authentication.getAuthorities().stream()
				.anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
		return factureMapper.toDTO(fSER.trouverFactureAccessible(idFacture, authentication.getName(), admin));
	}

	@GetMapping("/consultation/{idConsultation}")
	@PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
	public FactureDTO getFactureParConsultation(@PathVariable int idConsultation, Authentication authentication) {
		boolean admin = authentication.getAuthorities().stream()
				.anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
		return factureMapper.toDTO(
				fSER.trouverFactureParConsultationAccessible(idConsultation, authentication.getName(), admin));
	}

	@PostMapping("/generer/{idConsultation}")
	@PreAuthorize("hasAnyRole('MEDECIN', 'ADMIN')")
	public ResponseEntity<String> genererFacture(@PathVariable int idConsultation) {
		return fSER.genererFacture(idConsultation);
	}
}
