package com.ClinicPRO.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idUser;

	@NotBlank(message = "L'email est obligatoire")
	@Column(nullable = false, unique = true)
	private String email;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@NotBlank(message = "Le mot de passe est obligatoire")
	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@Column(nullable = false)
	private boolean enabled = true;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "patient_id", unique = true)
	private Patient patient;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "medecin_id", unique = true)
	private Medecin medecin;
}
