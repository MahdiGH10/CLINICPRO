package com.ClinicPRO.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.Medecin;
import com.ClinicPRO.entities.Patient;
import com.ClinicPRO.entities.RendezVous;
import com.ClinicPRO.repositories.MedecinRepository;
import com.ClinicPRO.repositories.PatientRepository;
import com.ClinicPRO.repositories.RendezVousRepository;

@Service
public class RendezVousService {

	@Autowired
	private RendezVousRepository rdvREP;

	@Autowired
	private PatientRepository pREP;

	@Autowired
	private MedecinRepository mREP;

	@Autowired
	private NotificationService notificationService;

	public List<RendezVous> trouverTousLesRendezVous() {
		return rdvREP.findAll();
	}

	public RendezVous trouverRendezVousParId(int idRendezVous) {
		return rdvREP.findById(idRendezVous).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous non trouvé avec cet ID"));
	}

	public List<RendezVous> trouverRendezVousParPatient(int idPatient) {
		return rdvREP.findByPatientIdPatient(idPatient);
	}

	public List<RendezVous> trouverRendezVousParMedecin(int idMedecin) {
		return rdvREP.findByMedecinIdMedecin(idMedecin);
	}

	public List<RendezVous> trouverRendezVousParStatut(String statut) {
		return rdvREP.findByStatut(statut);
	}

	public ResponseEntity<String> prendreRendezVous(RendezVous rendezVous, int idPatient, int idMedecin) {

		Patient patient = pREP.findById(idPatient).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient non trouvé avec cet ID"));

		Medecin medecin = mREP.findById(idMedecin).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin non trouvé avec cet ID"));

		List<RendezVous> rendezVousMedecin = rdvREP.findByMedecinIdMedecinAndDate(idMedecin, rendezVous.getDate());
		boolean heureOccupee = rendezVousMedecin.stream()
				.anyMatch(rdv -> rdv.getHeure().equals(rendezVous.getHeure())
						&& !rdv.getStatut().equals("ANNULE"));

		if (heureOccupee) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Le médecin n'est pas disponible à cette heure");
		}

		rendezVous.setPatient(patient);
		rendezVous.setMedecin(medecin);
		rendezVous.setStatut("PLANIFIE");
		rdvREP.save(rendezVous);

		notificationService.envoyerRappel(rendezVous);

		return ResponseEntity.ok("Rendez-vous pris avec succès");
	}

	public ResponseEntity<String> changerStatut(int idRendezVous, String statut) {
		rdvREP.findById(idRendezVous).ifPresentOrElse(
				rdv -> {
					rdv.setStatut(statut);
					rdvREP.save(rdv);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Statut mis à jour avec succès");
	}

	public ResponseEntity<String> annulerRendezVous(int idRendezVous, String motifAnnulation) {
		rdvREP.findById(idRendezVous).ifPresentOrElse(
				rdv -> {
					rdv.setStatut("ANNULE");
					rdv.setMotifAnnulation(motifAnnulation);
					rdvREP.save(rdv);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Rendez-vous annulé avec succès");
	}

	public ResponseEntity<String> supprimerRendezVous(int idRendezVous) {
		rdvREP.findById(idRendezVous).ifPresentOrElse(
				rdv -> rdvREP.deleteById(idRendezVous),
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Rendez-vous supprimé avec succès");
	}
}
