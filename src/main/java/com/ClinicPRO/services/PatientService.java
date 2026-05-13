package com.ClinicPRO.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.Patient;
import com.ClinicPRO.repositories.PatientRepository;

@Service
public class PatientService {

	@Autowired
	private PatientRepository pREP;

	public List<Patient> trouverTousLesPatients() {
		return pREP.findAll();
	}

	public Patient trouverPatientParId(int idPatient) {
		return pREP.findById(idPatient).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient non trouvé avec cet ID"));
	}

	public List<Patient> trouverPatientParNom(String nom) {
		return pREP.findByNomContaining(nom);
	}

	public ResponseEntity<String> ajouterPatient(Patient patient) {
		pREP.save(patient);
		return ResponseEntity.ok("Patient ajouté avec succès");
	}

	public ResponseEntity<String> mettreAJourPatient(int idPatient, Patient patientModifie) {
		pREP.findById(idPatient).ifPresentOrElse(
				patient -> {
					patient.setNom(patientModifie.getNom());
					patient.setDossierMedical(patientModifie.getDossierMedical());
					patient.setDateNaissance(patientModifie.getDateNaissance());
					patient.setTel(patientModifie.getTel());
					patient.setEmail(patientModifie.getEmail());
					pREP.save(patient);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Patient mis à jour avec succès");
	}

	public ResponseEntity<String> mettreAJourDossierMedical(int idPatient, Patient patientModifie) {
		pREP.findById(idPatient).ifPresentOrElse(
				patient -> {
					patient.setDossierMedical(patientModifie.getDossierMedical());
					pREP.save(patient);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Dossier médical mis à jour avec succès");
	}

	public ResponseEntity<String> supprimerPatient(int idPatient) {
		pREP.findById(idPatient).ifPresentOrElse(
				patient -> pREP.deleteById(idPatient),
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Patient supprimé avec succès");
	}
}