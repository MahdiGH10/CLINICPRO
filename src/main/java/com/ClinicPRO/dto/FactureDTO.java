package com.ClinicPRO.dto;

import java.util.Date;

import lombok.Data;

@Data
public class FactureDTO {

	private int idFacture;
	private Date dateFacture;
	private double montant;

	private ConsultationDTO consultation;
}