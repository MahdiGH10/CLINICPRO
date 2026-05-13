package com.ClinicPRO.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.Consultation;
import com.ClinicPRO.entities.Facture;
import com.ClinicPRO.repositories.ConsultationRepository;
import com.ClinicPRO.repositories.FactureRepository;

@Service
public class FactureService {

	@Autowired
	private FactureRepository fREP;

	@Autowired
	private ConsultationRepository cREP;

	public List<Facture> trouverToutesLesFactures() {
		return fREP.findAll();
	}

	public Facture trouverFactureParId(int idFacture) {
		return fREP.findById(idFacture).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Facture non trouvée avec cet ID"));
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
}