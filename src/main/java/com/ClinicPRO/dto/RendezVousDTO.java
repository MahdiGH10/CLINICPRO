package com.ClinicPRO.dto;

import java.util.Date;

import lombok.Data;

@Data
public class RendezVousDTO {

	private int idRendezVous;
	private Date date;
	private String heure;
	private String motif;
	private String statut;
	private String motifAnnulation;

	private PatientDTO patient;
	private MedecinDTO medecin;
}
