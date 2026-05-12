package com.ClinicPRO.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class RendezVous {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idRendezVous;
	/*@NotNull= Cannot be empty*/
	@NotNull(message = "La date est obligatoire")
	private Date date;
	/*@NotBlank= Cannot be empty or just spaces*/
	@NotBlank(message = "L'heure est obligatoire")
	private String heure;

	@NotBlank(message = "Le motif est obligatoire")
	private String motif;

	private String statut = "PLANIFIE";

	@ManyToOne
	@JoinColumn(name = "idPatient")
	private Patient patient;

	@ManyToOne
	@JoinColumn(name = "idMedecin")
	private Medecin medecin;

	@OneToOne(mappedBy = "rendezVous")
	private Consultation consultation;
}