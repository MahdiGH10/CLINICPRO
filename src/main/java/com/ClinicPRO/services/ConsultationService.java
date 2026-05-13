package com.ClinicPRO.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.Consultation;
import com.ClinicPRO.entities.RendezVous;
import com.ClinicPRO.repositories.ConsultationRepository;
import com.ClinicPRO.repositories.RendezVousRepository;

@Service
public class ConsultationService {

	@Autowired
	private ConsultationRepository cREP;

	@Autowired
	private RendezVousRepository rdvREP;

	@Autowired
	private FactureService factureService;

	public List<Consultation> trouverToutesLesConsultations() {
		return cREP.findAll();
	}

	public Consultation trouverConsultationParId(int idConsultation) {
		return cREP.findById(idConsultation).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation non trouvée avec cet ID"));
	}

	public List<Consultation> trouverConsultationsParPatient(int idPatient) {
		return cREP.findByRendezVousPatientIdPatient(idPatient);
	}

	public List<Consultation> trouverConsultationsParMedecin(int idMedecin) {
		return cREP.findByRendezVousMedecinIdMedecin(idMedecin);
	}

	public ResponseEntity<String> ajouterConsultation(Consultation consultation, int idRendezVous) {

		RendezVous rendezVous = rdvREP.findById(idRendezVous).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous non trouvé avec cet ID"));

		boolean dejaConsulte = cREP.findAll().stream()
				.anyMatch(c -> c.getRendezVous() != null && c.getRendezVous().getIdRendezVous() == idRendezVous);

		if (dejaConsulte) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Une consultation existe déjà pour ce rendez-vous");
		}

		consultation.setRendezVous(rendezVous);
		rendezVous.setStatut("TERMINE");
		rdvREP.save(rendezVous);
		Consultation consultationEnregistree = cREP.save(consultation);
		factureService.genererFacture(consultationEnregistree);

		return ResponseEntity.ok("Consultation enregistrée avec succès");
	}

	public ResponseEntity<String> mettreAJourConsultation(int idConsultation, Consultation consultationModifiee) {
		cREP.findById(idConsultation).ifPresentOrElse(
				consultation -> {
					consultation.setDiagnostic(consultationModifiee.getDiagnostic());
					consultation.setOrdonnance(consultationModifiee.getOrdonnance());
					consultation.setPrix(consultationModifiee.getPrix());
					cREP.save(consultation);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation non trouvée avec cet ID");
				});
		return ResponseEntity.ok("Consultation mise à jour avec succès");
	}

	public ResponseEntity<String> supprimerConsultation(int idConsultation) {
		cREP.findById(idConsultation).ifPresentOrElse(
				consultation -> cREP.deleteById(idConsultation),
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation non trouvée avec cet ID");
				});
		return ResponseEntity.ok("Consultation supprimée avec succès");
	}
}
