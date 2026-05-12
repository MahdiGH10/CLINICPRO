package com.ClinicPRO.dto;

import lombok.Data;

@Data
public class ConsultationDTO {

	private int idConsultation;
	private String diagnostic;
	private String ordonnance;
	private double prix;

	private RendezVousDTO rendezVous;
}
