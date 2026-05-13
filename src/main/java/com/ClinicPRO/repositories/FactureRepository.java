package com.ClinicPRO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.Facture;

public interface FactureRepository extends JpaRepository<Facture, Integer> {

	Facture findByConsultationIdConsultation(int idConsultation);
}