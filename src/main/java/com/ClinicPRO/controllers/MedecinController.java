package com.ClinicPRO.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClinicPRO.dto.MedecinDTO;
import com.ClinicPRO.entities.Medecin;
import com.ClinicPRO.mapper.MedecinMapper;
import com.ClinicPRO.services.MedecinService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/medecin")
public class MedecinController {

	@Autowired
	private MedecinService mSER;

	@Autowired
	private MedecinMapper medecinMapper;

	@GetMapping("/tous")
	public List<MedecinDTO> getTousLesMedecins() {
		return medecinMapper.toListDTO(mSER.trouverTousLesMedecins());
	}

	@GetMapping("/{idMedecin}")
	public MedecinDTO getMedecinParId(@PathVariable int idMedecin) {
		return medecinMapper.toDTO(mSER.trouverMedecinParId(idMedecin));
	}

	@GetMapping("/specialite/{specialite}")
	public List<MedecinDTO> getMedecinParSpecialite(@PathVariable String specialite) {
		return medecinMapper.toListDTO(mSER.trouverMedecinParSpecialite(specialite));
	}

	@GetMapping("/disponible/{disponibilite}")
	public List<MedecinDTO> getMedecinDisponible(@PathVariable String disponibilite) {
		return medecinMapper.toListDTO(mSER.trouverMedecinDisponible(disponibilite));
	}

	@PostMapping("/ajouter")
	public ResponseEntity<String> ajouterMedecin(@Valid @RequestBody Medecin medecin) {
		return mSER.ajouterMedecin(medecin);
	}

	@PutMapping("/mettreAJour/{idMedecin}")
	public ResponseEntity<String> mettreAJourMedecin(@PathVariable int idMedecin,
			@Valid @RequestBody Medecin medecin) {
		return mSER.mettreAJourMedecin(idMedecin, medecin);
	}

	@DeleteMapping("/supprimer/{idMedecin}")
	public ResponseEntity<String> supprimerMedecin(@PathVariable int idMedecin) {
		return mSER.supprimerMedecin(idMedecin);
	}
}
