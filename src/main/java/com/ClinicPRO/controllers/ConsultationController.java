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

import com.ClinicPRO.dto.ConsultationDTO;
import com.ClinicPRO.entities.Consultation;
import com.ClinicPRO.mapper.ConsultationMapper;
import com.ClinicPRO.services.ConsultationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/consultation")
public class ConsultationController {

	@Autowired
	private ConsultationService cSER;

	@Autowired
	private ConsultationMapper consultationMapper;

	@GetMapping("/toutes")
	public List<ConsultationDTO> getToutesLesConsultations() {
		return consultationMapper.toListDTO(cSER.trouverToutesLesConsultations());
	}

	@GetMapping("/{idConsultation}")
	public ConsultationDTO getConsultationParId(@PathVariable int idConsultation) {
		return consultationMapper.toDTO(cSER.trouverConsultationParId(idConsultation));
	}

	@GetMapping("/patient/{idPatient}")
	public List<ConsultationDTO> getConsultationsParPatient(@PathVariable int idPatient) {
		return consultationMapper.toListDTO(cSER.trouverConsultationsParPatient(idPatient));
	}

	@GetMapping("/medecin/{idMedecin}")
	public List<ConsultationDTO> getConsultationsParMedecin(@PathVariable int idMedecin) {
		return consultationMapper.toListDTO(cSER.trouverConsultationsParMedecin(idMedecin));
	}

	@PostMapping("/ajouter/{idRendezVous}")
	public ResponseEntity<String> ajouterConsultation(@RequestBody Consultation consultation,
			@PathVariable int idRendezVous) {
		return cSER.ajouterConsultation(consultation, idRendezVous);
	}

	@PutMapping("/mettreAJour/{idConsultation}")
	public ResponseEntity<String> mettreAJourConsultation(@PathVariable int idConsultation,
			@Valid @RequestBody Consultation consultation) {
		return cSER.mettreAJourConsultation(idConsultation, consultation);
	}

	@DeleteMapping("/supprimer/{idConsultation}")
	public ResponseEntity<String> supprimerConsultation(@PathVariable int idConsultation) {
		return cSER.supprimerConsultation(idConsultation);
	}
}
