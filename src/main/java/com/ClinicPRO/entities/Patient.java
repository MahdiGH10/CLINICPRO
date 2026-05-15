package com.ClinicPRO.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Patient {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idPatient;
	/*input validation et control*/
	@NotBlank(message = "Le nom est obligatoire")
	@Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
	private String nom;

	private String dossierMedical;

	private Date dateNaissance;

	@NotBlank(message = "Le téléphone est obligatoire")
	@Pattern(regexp = "^[0-9]{8}$", message = "Le téléphone doit contenir 8 chiffres")
	private String tel;

	private String email;

	@JsonIgnore
	@OneToOne(mappedBy = "patient", fetch = FetchType.LAZY)
	private AppUser appUser;

	@OneToMany(mappedBy = "patient")
	private List<RendezVous> listRendezVous = new ArrayList<>();
}
