package com.ClinicPRO.dto;

import java.util.Date;

import lombok.Data;

@Data
public class PatientDTO {

	private int idPatient;
	private String nom;
	private String dossierMedical;
	private Date dateNaissance;
	private String tel;
}