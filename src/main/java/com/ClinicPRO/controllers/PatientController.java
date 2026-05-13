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

import com.ClinicPRO.dto.PatientDTO;
import com.ClinicPRO.entities.Patient;
import com.ClinicPRO.mapper.PatientMapper;
import com.ClinicPRO.services.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/patient")
public class PatientController {

	@Autowired
	private PatientService pSER;

	@Autowired
	private PatientMapper patientMapper;

	@GetMapping("/tous")
	public List<PatientDTO> getTousLesPatients() {
		return patientMapper.toListDTO(pSER.trouverTousLesPatients());
	}

	@GetMapping("/{idPatient}")
	public PatientDTO getPatientParId(@PathVariable int idPatient) {
		return patientMapper.toDTO(pSER.trouverPatientParId(idPatient));
	}

	@GetMapping("/nom/{nom}")
	public List<PatientDTO> getPatientParNom(@PathVariable String nom) {
		return patientMapper.toListDTO(pSER.trouverPatientParNom(nom));
	}

	@PostMapping("/ajouter")
	public ResponseEntity<String> ajouterPatient(@Valid @RequestBody Patient patient) {
		return pSER.ajouterPatient(patient);
	}

	@PutMapping("/mettreAJour/{idPatient}")
	public ResponseEntity<String> mettreAJourPatient(@PathVariable int idPatient,
			@Valid @RequestBody Patient patient) {
		return pSER.mettreAJourPatient(idPatient, patient);
	}

	@PutMapping("/dossierMedical/{idPatient}")
	public ResponseEntity<String> mettreAJourDossierMedical(@PathVariable int idPatient,
			@RequestBody Patient patient) {
		return pSER.mettreAJourDossierMedical(idPatient, patient);
	}

	@DeleteMapping("/supprimer/{idPatient}")
	public ResponseEntity<String> supprimerPatient(@PathVariable int idPatient) {
		return pSER.supprimerPatient(idPatient);
	}
}