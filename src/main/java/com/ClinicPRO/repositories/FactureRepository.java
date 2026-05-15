package com.ClinicPRO.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.Facture;

public interface FactureRepository extends JpaRepository<Facture, Integer> {

	Facture findByConsultationIdConsultation(int idConsultation);

	List<Facture> findByConsultationRendezVousPatientIdPatient(int idPatient);
}
