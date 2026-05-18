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
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class RendezVous {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idRendezVous;

	@NotNull(message = "La date est obligatoire")
	private Date date;

	@NotBlank(message = "L'heure est obligatoire")
	@Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "L'heure doit être au format HH:mm")
	private String heure;

	@NotBlank(message = "Le motif est obligatoire")
	@Size(min = 2, max = 255, message = "Le motif doit contenir entre 2 et 255 caractères")
	private String motif;

	@Pattern(regexp = "^(PLANIFIE|TERMINE|ANNULE)$", message = "Statut de rendez-vous invalide")
	private String statut = "PLANIFIE";

	@Size(max = 255, message = "Le motif d'annulation ne doit pas dépasser 255 caractères")
	private String motifAnnulation;

	@ManyToOne
	@JoinColumn(name = "idPatient")
	private Patient patient;

	@ManyToOne
	@JoinColumn(name = "idMedecin")
	private Medecin medecin;

	@OneToOne(mappedBy = "rendezVous")
	private Consultation consultation;
}
