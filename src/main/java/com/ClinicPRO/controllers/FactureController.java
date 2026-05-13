package com.ClinicPRO.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClinicPRO.dto.FactureDTO;
import com.ClinicPRO.mapper.FactureMapper;
import com.ClinicPRO.services.FactureService;

@RestController
@RequestMapping("/facture")
public class FactureController {

	@Autowired
	private FactureService fSER;

	@Autowired
	private FactureMapper factureMapper;

	@GetMapping("/toutes")
	public List<FactureDTO> getToutesLesFactures() {
		return factureMapper.toListDTO(fSER.trouverToutesLesFactures());
	}

	@GetMapping("/{idFacture}")
	public FactureDTO getFactureParId(@PathVariable int idFacture) {
		return factureMapper.toDTO(fSER.trouverFactureParId(idFacture));
	}

	@GetMapping("/consultation/{idConsultation}")
	public FactureDTO getFactureParConsultation(@PathVariable int idConsultation) {
		return factureMapper.toDTO(fSER.trouverFactureParConsultation(idConsultation));
	}

	@PostMapping("/generer/{idConsultation}")
	public ResponseEntity<String> genererFacture(@PathVariable int idConsultation) {
		return fSER.genererFacture(idConsultation);
	}
}