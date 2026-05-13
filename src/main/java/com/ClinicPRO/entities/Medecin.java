package com.ClinicPRO.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Medecin {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idMedecin;

	@NotBlank(message = "Le nom est obligatoire")
	@Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
	private String nom;

	@NotBlank(message = "La spécialité est obligatoire")
	private String specialite;

	private String disponibilite;

	private String email;

	@OneToMany(mappedBy = "medecin")
	private List<RendezVous> listRendezVous = new ArrayList<>();
}