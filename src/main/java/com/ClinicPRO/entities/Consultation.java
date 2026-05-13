package com.ClinicPRO.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Consultation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idConsultation;

	@NotBlank(message = "Le diagnostic est obligatoire")
	private String diagnostic;

	private String ordonnance;

	@Positive(message = "Le prix doit être positif")
	private double prix;

	@OneToOne
	@JoinColumn(name = "idRendezVous")
	private RendezVous rendezVous;

	@OneToOne(mappedBy = "consultation")
	private Facture facture;
}
