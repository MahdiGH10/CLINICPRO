package com.ClinicPRO.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMedecinRequest {

	@NotBlank(message = "Le nom est obligatoire")
	@Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
	private String nom;

	@NotBlank(message = "La spécialité est obligatoire")
	private String specialite;

	private String disponibilite;

	@NotBlank(message = "L'email est obligatoire")
	private String email;

	@NotBlank(message = "Le mot de passe est obligatoire")
	private String password;
}
