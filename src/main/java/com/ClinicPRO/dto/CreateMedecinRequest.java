package com.ClinicPRO.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMedecinRequest {

	@NotBlank(message = "Le nom est obligatoire")
	@Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
	private String nom;

	@NotBlank(message = "La spécialité est obligatoire")
	@Size(min = 2, max = 100, message = "La spécialité doit contenir entre 2 et 100 caractères")
	private String specialite;

	@Size(max = 255, message = "La disponibilité ne doit pas dépasser 255 caractères")
	private String disponibilite;

	@NotBlank(message = "L'email est obligatoire")
	@Email(message = "Format d'email invalide")
	private String email;

	@NotBlank(message = "Le mot de passe est obligatoire")
	@Size(min = 8, max = 100, message = "Le mot de passe doit contenir entre 8 et 100 caractères")
	private String password;
}
