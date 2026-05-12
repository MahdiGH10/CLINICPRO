package com.ClinicPRO.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import  com.ClinicPRO.dto.RendezVousDTO;
import  com.ClinicPRO.entities.RendezVous;

@Component
public class RendezVousMapper {

	@Autowired
	private ModelMapper modelMapper;

	public RendezVousDTO toDTO(RendezVous rendezVous) {
		return modelMapper.map(rendezVous, RendezVousDTO.class);
	}

	public RendezVous fromDTO(RendezVousDTO dto) {
		return modelMapper.map(dto, RendezVous.class);
	}

	public List<RendezVousDTO> toListDTO(List<RendezVous> listRendezVous) {
		return listRendezVous.stream()
				.map(rdv -> modelMapper.map(rdv, RendezVousDTO.class))
				.collect(Collectors.toList());
	}
}
