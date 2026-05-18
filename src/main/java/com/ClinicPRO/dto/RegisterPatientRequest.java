package com.ClinicPRO.dto;

import java.util.Date;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterPatientRequest {

	@NotBlank(message = "Le nom est obligatoire")
	@Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
	private String nom;

	@NotNull(message = "La date de naissance est obligatoire")
	@Past(message = "La date de naissance doit être dans le passé")
	private Date dateNaissance;

	@NotBlank(message = "Le téléphone est obligatoire")
	@Pattern(regexp = "^[0-9]{8}$", message = "Le téléphone doit contenir 8 chiffres")
	private String tel;

	@NotBlank(message = "L'email est obligatoire")
	@Email(message = "Format d'email invalide")
	private String email;

	@NotBlank(message = "Le mot de passe est obligatoire")
	@Size(min = 8, max = 100, message = "Le mot de passe doit contenir entre 8 et 100 caractères")
	private String password;
}
