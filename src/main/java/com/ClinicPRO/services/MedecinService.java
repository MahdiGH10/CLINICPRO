package com.ClinicPRO.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ClinicPRO.entities.Medecin;
import com.ClinicPRO.repositories.MedecinRepository;

@Service
public class MedecinService {

	@Autowired
	private MedecinRepository mREP;

	public List<Medecin> trouverTousLesMedecins() {
		return mREP.findAll();
	}

	public Medecin trouverMedecinParId(int idMedecin) {
		return mREP.findById(idMedecin).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin non trouvé avec cet ID"));
	}

	public List<Medecin> trouverMedecinParSpecialite(String specialite) {
		return mREP.findBySpecialite(specialite);
	}

	public List<Medecin> trouverMedecinDisponible(String disponibilite) {
		return mREP.findByDisponibilite(disponibilite);
	}

	public ResponseEntity<String> ajouterMedecin(Medecin medecin) {
		mREP.save(medecin);
		return ResponseEntity.ok("Médecin ajouté avec succès");
	}

	public ResponseEntity<String> mettreAJourMedecin(int idMedecin, Medecin medecinModifie) {
		mREP.findById(idMedecin).ifPresentOrElse(
				medecin -> {
					medecin.setNom(medecinModifie.getNom());
					medecin.setSpecialite(medecinModifie.getSpecialite());
					medecin.setDisponibilite(medecinModifie.getDisponibilite());
					medecin.setEmail(medecinModifie.getEmail());
					mREP.save(medecin);
				},
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Médecin mis à jour avec succès");
	}

	public ResponseEntity<String> supprimerMedecin(int idMedecin) {
		mREP.findById(idMedecin).ifPresentOrElse(
				medecin -> mREP.deleteById(idMedecin),
				() -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin non trouvé avec cet ID");
				});
		return ResponseEntity.ok("Médecin supprimé avec succès");
	}
}
