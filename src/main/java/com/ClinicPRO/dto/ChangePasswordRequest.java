package com.ClinicPRO.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

	@NotBlank(message = "L'ancien mot de passe est obligatoire")
	private String currentPassword;

	@NotBlank(message = "Le nouveau mot de passe est obligatoire")
	@Size(min = 8, max = 100, message = "Le mot de passe doit contenir entre 8 et 100 caractères")
	private String newPassword;
}
