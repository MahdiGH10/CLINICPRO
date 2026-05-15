package com.ClinicPRO.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationResponse {

	private String message;
	private String email;
	private String role;
	private String motDePasseTemporaire;
}
