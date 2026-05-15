package com.ClinicPRO.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {

	@NotBlank(message = "L'email est obligatoire")
	private String email;

	@NotBlank(message = "Le mot de passe est obligatoire")
	private String password;
}
