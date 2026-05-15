package com.ClinicPRO.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class MedecinDTO {

	private int idMedecin;
	private String nom;
	private String specialite;
	private String disponibilite;
	private String email;
	
}
