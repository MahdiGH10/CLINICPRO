package com.ClinicPRO.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Integer> {

	List<Medecin> findBySpecialite(String specialite);

	List<Medecin> findByNomContaining(String nom);

	List<Medecin> findByDisponibilite(String disponibilite);

	// Find a medecin by email (used for efficient lookups)
	Optional<Medecin> findByEmail(String email);
}
