package com.ClinicPRO.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI clinicProOpenApi() {
		return new OpenAPI().info(new Info()
				.title("ClinicPRO API")
				.description("Documentation des APIs pour la gestion de la clinique (patients, medecins, rendez-vous, consultations, factures)")
				.version("v1")
				.contact(new Contact().name("ClinicPRO Team").email("support@clinicpro.local")));
	}
}