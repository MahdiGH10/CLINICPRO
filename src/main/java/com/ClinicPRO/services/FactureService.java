package com.ClinicPRO.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.AppUser;
import com.ClinicPRO.entities.Consultation;
import com.ClinicPRO.entities.Facture;
import com.ClinicPRO.repositories.AppUserRepository;
import com.ClinicPRO.repositories.ConsultationRepository;
import com.ClinicPRO.repositories.FactureRepository;

@Service
public class FactureService {

	@Autowired
	private FactureRepository fREP;

	@Autowired
	private ConsultationRepository cREP;

	@Autowired
	private AppUserRepository auREP;

	public List<Facture> trouverToutesLesFactures() {
		return fREP.findAll();
	}

	public Facture trouverFactureParId(int idFacture) {
		return fREP.findById(idFacture).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Facture non trouvée avec cet ID"));
	}

	@Transactional(readOnly = true)
	public List<Facture> trouverFacturesDuPatientConnecte(String email) {
		AppUser appUser = trouverUtilisateur(email);

		if (appUser.getPatient() == null) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Aucun profil patient associe a ce compte");
		}

		return fREP.findByConsultationRendezVousPatientIdPatient(appUser.getPatient().getIdPatient());
	}

	@Transactional(readOnly = true)
	public Facture trouverFactureAccessible(int idFacture, String email, boolean admin) {
		Facture facture = trouverFactureParId(idFacture);

		if (admin) {
			return facture;
		}

		AppUser appUser = trouverUtilisateur(email);
		Integer idPatientConnecte = appUser.getPatient() != null ? appUser.getPatient().getIdPatient() : null;
		Integer idPatientFacture = facture.getConsultation() != null
				&& facture.getConsultation().getRendezVous() != null
				&& facture.getConsultation().getRendezVous().getPatient() != null
						? facture.getConsultation().getRendezVous().getPatient().getIdPatient()
						: null;

		if (idPatientConnecte == null || !idPatientConnecte.equals(idPatientFacture)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cette facture");
		}

		return facture;
	}

	@Transactional(readOnly = true)
	public Facture trouverFactureParConsultationAccessible(int idConsultation, String email, boolean admin) {
		Facture facture = trouverFactureParConsultation(idConsultation);

		if (admin) {
			return facture;
		}

		AppUser appUser = trouverUtilisateur(email);
		Integer idMedecinConnecte = appUser.getMedecin() != null ? appUser.getMedecin().getIdMedecin() : null;
		Integer idMedecinFacture = facture.getConsultation() != null
				&& facture.getConsultation().getRendezVous() != null
				&& facture.getConsultation().getRendezVous().getMedecin() != null
						? facture.getConsultation().getRendezVous().getMedecin().getIdMedecin()
						: null;

		if (idMedecinConnecte == null || !idMedecinConnecte.equals(idMedecinFacture)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acces refuse a cette facture");
		}

		return facture;
	}

	public Facture trouverFactureParConsultation(int idConsultation) {
		Facture facture = fREP.findByConsultationIdConsultation(idConsultation);

		if (facture == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Facture non trouvée avec cet ID de consultation");
		}

		return facture;
	}

	public Facture genererFacture(Consultation consultation) {
		Facture factureExistante = fREP.findByConsultationIdConsultation(consultation.getIdConsultation());

		if (factureExistante != null) {
			return factureExistante;
		}

		Facture facture = new Facture();
		facture.setDateFacture(new Date());
		facture.setMontant(consultation.getPrix());
		facture.setConsultation(consultation);
		fREP.save(facture);

		return facture;
	}

	public ResponseEntity<String> genererFacture(int idConsultation) {
		Consultation consultation = cREP.findById(idConsultation).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation non trouvée avec cet ID"));

		genererFacture(consultation);

		return ResponseEntity.ok("Facture générée avec succès");
	}

	private AppUser trouverUtilisateur(String email) {
		return auREP.findByEmail(email).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie"));
	}
}
