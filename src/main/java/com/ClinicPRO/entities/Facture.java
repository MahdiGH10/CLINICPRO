package com.ClinicPRO.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Facture {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idFacture;

	private Date dateFacture;

	@Positive(message = "Le montant doit être positif")
	private double montant;

	@OneToOne
	@JoinColumn(name = "idConsultation")
	private Consultation consultation;
}