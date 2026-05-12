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

import com.ClinicPRO.dto.RendezVousDTO;
import com.ClinicPRO.entities.RendezVous;
import com.ClinicPRO.mapper.RendezVousMapper;
import com.ClinicPRO.services.RendezVousService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/rendezVous")
public class RendezVousController {

	@Autowired
	private RendezVousService rdvSER;

	@Autowired
	private RendezVousMapper rendezVousMapper;

	@GetMapping("/tous")
	public List<RendezVousDTO> getTousLesRendezVous() {
		return rendezVousMapper.toListDTO(rdvSER.trouverTousLesRendezVous());
	}

	@GetMapping("/{idRendezVous}")
	public RendezVousDTO getRendezVousParId(@PathVariable int idRendezVous) {
		return rendezVousMapper.toDTO(rdvSER.trouverRendezVousParId(idRendezVous));
	}

	@GetMapping("/patient/{idPatient}")
	public List<RendezVousDTO> getRendezVousParPatient(@PathVariable int idPatient) {
		return rendezVousMapper.toListDTO(rdvSER.trouverRendezVousParPatient(idPatient));
	}

	@GetMapping("/medecin/{idMedecin}")
	public List<RendezVousDTO> getRendezVousParMedecin(@PathVariable int idMedecin) {
		return rendezVousMapper.toListDTO(rdvSER.trouverRendezVousParMedecin(idMedecin));
	}

	@GetMapping("/statut/{statut}")
	public List<RendezVousDTO> getRendezVousParStatut(@PathVariable String statut) {
		return rendezVousMapper.toListDTO(rdvSER.trouverRendezVousParStatut(statut));
	}

	@PostMapping("/prendre/{idPatient}/{idMedecin}")
	public ResponseEntity<String> prendreRendezVous(@Valid @RequestBody RendezVous rendezVous,
			@PathVariable int idPatient,
			@PathVariable int idMedecin) {
		return rdvSER.prendreRendezVous(rendezVous, idPatient, idMedecin);
	}

	@PutMapping("/statut/{idRendezVous}/{statut}")
	public ResponseEntity<String> changerStatut(@PathVariable int idRendezVous,
			@PathVariable String statut) {
		return rdvSER.changerStatut(idRendezVous, statut);
	}

	@DeleteMapping("/supprimer/{idRendezVous}")
	public ResponseEntity<String> supprimerRendezVous(@PathVariable int idRendezVous) {
		return rdvSER.supprimerRendezVous(idRendezVous);
	}
}
