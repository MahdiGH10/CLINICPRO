package com.ClinicPRO.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Integer> {

	List<Medecin> findBySpecialite(String specialite);

	List<Medecin> findByNomContaining(String nom);

	List<Medecin> findByDisponibilite(String disponibilite);
}
