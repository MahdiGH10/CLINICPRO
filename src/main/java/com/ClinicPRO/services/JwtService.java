package com.ClinicPRO.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ClinicPRO.entities.AppUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${app.jwt.secret:clinicpro-dev-secret-key-clinicpro-dev-secret-key-clinicpro-dev-secret-key}")
	private String secret;

	@Value("${app.jwt.expiration-ms:86400000}")
	private long expirationMs;

	public String genererToken(AppUser user) {
		return genererToken(user.getEmail(), Map.of("role", user.getRole().name()));
	}

	public String genererToken(String sujet, Map<String, Object> claims) {
		Date maintenant = new Date();
		Date expiration = new Date(maintenant.getTime() + expirationMs);
		return Jwts.builder()
				.subject(sujet)
				.claims(claims)
				.issuedAt(maintenant)
				.expiration(expiration)
				.signWith(getCleSignature())
				.compact();
	}

	public String extraireNomUtilisateur(String token) {
		return extraireTousClaims(token).getSubject();
	}

	public String extraireRole(String token) {
		Object role = extraireTousClaims(token).get("role");
		return role == null ? null : role.toString();
	}

	public boolean estTokenValide(String token, UserDetails userDetails) {
		return extraireNomUtilisateur(token).equals(userDetails.getUsername()) && !estTokenExpire(token);
	}

	private boolean estTokenExpire(String token) {
		return extraireTousClaims(token).getExpiration().before(new Date());
	}

	private Claims extraireTousClaims(String token) {
		return Jwts.parser()
				.verifyWith(getCleSignature())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey getCleSignature() {
		byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
		if (keyBytes.length < 32) {
			keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(keyBytes));
		}
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
