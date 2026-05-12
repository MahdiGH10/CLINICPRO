package com.ClinicPRO.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.RendezVous;

public interface RendezVousRepository extends JpaRepository<RendezVous, Integer> {

	List<RendezVous> findByStatut(String statut);

	List<RendezVous> findByDateBetween(Date date1, Date date2);

	List<RendezVous> findByMedecinIdMedecinAndDate(int idMedecin, Date date);

	List<RendezVous> findByPatientIdPatient(int idPatient);

	List<RendezVous> findByMedecinIdMedecin(int idMedecin);
}
