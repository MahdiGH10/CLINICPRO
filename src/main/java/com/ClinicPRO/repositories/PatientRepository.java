package com.ClinicPRO.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ClinicPRO.entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

	List<Patient> findByNom(String nom);

	List<Patient> findByNomContaining(String nom);

	List<Patient> findByTel(String tel);

	// Find a patient by email to avoid full table scans
	Optional<Patient> findByEmail(String email);
}