package com.ClinicPRO.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Consultation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idConsultation;

	@NotBlank(message = "Le diagnostic est obligatoire")
	@Size(min = 2, max = 2000, message = "Le diagnostic doit contenir entre 2 et 2000 caractères")
	@Column(length = 2000)
	private String diagnostic;

	@Size(max = 2000, message = "L'ordonnance ne doit pas dépasser 2000 caractères")
	@Column(length = 2000)
	private String ordonnance;

	@Positive(message = "Le prix doit être positif")
	private double prix;

	@OneToOne
	@JoinColumn(name = "idRendezVous")
	private RendezVous rendezVous;

	@OneToOne(mappedBy = "consultation")
	private Facture facture;
}
