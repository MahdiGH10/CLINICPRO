package com.ClinicPRO.services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ClinicPRO.entities.RendezVous;
import com.ClinicPRO.repositories.RendezVousRepository;

@Service
public class NotificationService {

	@Autowired
	private RendezVousRepository rdvREP;

	public void envoyerRappel(RendezVous rendezVous) {
		System.out.println("=== NOTIFICATION ===");
		System.out.println("Rappel envoyé au patient : " + rendezVous.getPatient().getNom());
		System.out.println("Rendez-vous le : " + rendezVous.getDate() + " à " + rendezVous.getHeure());
		System.out.println("Médecin : Dr. " + rendezVous.getMedecin().getNom());
		System.out.println("Motif : " + rendezVous.getMotif());
		System.out.println("====================");
	}

	@Scheduled(cron = "0 0 8 * * *")
	public void rappelAutomatiqueJournalier() {
		List<RendezVous> rendezVousAujourdhui = rdvREP.findByStatut("PLANIFIE");
		System.out.println("=== RAPPELS AUTOMATIQUES DU JOUR ===");
		rendezVousAujourdhui.forEach(rdv -> {
			System.out.println("Rappel pour : " + rdv.getPatient().getNom()
					+ " | Médecin : Dr. " + rdv.getMedecin().getNom()
					+ " | Heure : " + rdv.getHeure());
		});
		System.out.println("Total rappels envoyés : " + rendezVousAujourdhui.size());
		System.out.println("====================================");
	}
}
