package com.ClinicPRO.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ClinicPRO.entities.RendezVous;
import com.ClinicPRO.repositories.RendezVousRepository;

@Service
public class NotificationService {

	private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

	@Autowired
	private RendezVousRepository rdvREP;

	public void envoyerRappel(RendezVous rendezVous) {
		logger.info("=== NOTIFICATION ===");
		logger.info("Rappel envoyé au patient : {}", rendezVous.getPatient().getNom());
		logger.info("Rendez-vous le : {} à {}", rendezVous.getDate(), rendezVous.getHeure());
		logger.info("Médecin : Dr. {}", rendezVous.getMedecin().getNom());
		logger.info("Motif : {}", rendezVous.getMotif());
		logger.info("====================");
	}

	@Scheduled(cron = "0 0 8 * * *")
	public void rappelAutomatiqueJournalier() {
		/* Filtre les RDV PLANIFIE du jour uniquement (avant : récupérait TOUS les PLANIFIE) */
		Date debutJour = debutDuJour();
		Date finJour = finDuJour();

		List<RendezVous> rendezVousAujourdhui = rdvREP.findByStatutAndDateBetween("PLANIFIE", debutJour, finJour);

		logger.info("=== RAPPELS AUTOMATIQUES DU JOUR ===");
		rendezVousAujourdhui.forEach(rdv -> {
			logger.info("Rappel pour : {} | Médecin : Dr. {} | Heure : {}",
					rdv.getPatient().getNom(),
					rdv.getMedecin().getNom(),
					rdv.getHeure());
		});
		logger.info("Total rappels envoyés : {}", rendezVousAujourdhui.size());
		logger.info("====================================");
	}

	private Date debutDuJour() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	private Date finDuJour() {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		cal.set(Calendar.MILLISECOND, 999);
		return cal.getTime();
	}
}
