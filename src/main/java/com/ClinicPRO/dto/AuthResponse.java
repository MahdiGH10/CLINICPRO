package com.ClinicPRO.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {

	private String token;
	private String email;
	private String role;
	private String message;
	private boolean mustChangePassword;

	public AuthResponse(String token, String email, String role, String message) {
		this(token, email, role, message, false);
	}

	public AuthResponse(String token, String email, String role, String message, boolean mustChangePassword) {
		this.token = token;
		this.email = email;
		this.role = role;
		this.message = message;
		this.mustChangePassword = mustChangePassword;
	}
}
