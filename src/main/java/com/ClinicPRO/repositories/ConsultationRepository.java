package  com.ClinicPRO.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import  com.ClinicPRO.entities.Consultation;

public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {

	List<Consultation> findByRendezVousPatientIdPatient(int idPatient);

	List<Consultation> findByRendezVousMedecinIdMedecin(int idMedecin);

	List<Consultation> findByPrixLessThan(double prix);

	List<Consultation> findByPrixGreaterThan(double prix);
}
