package com.ClinicPRO.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {

	private String email;
	private String role;
	private Integer idPatient;
	private Integer idMedecin;
}
