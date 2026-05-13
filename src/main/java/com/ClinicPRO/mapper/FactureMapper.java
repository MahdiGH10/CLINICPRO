package com.ClinicPRO.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ClinicPRO.dto.FactureDTO;
import com.ClinicPRO.entities.Facture;

@Component
public class FactureMapper {

	@Autowired
	private ModelMapper modelMapper;

	public FactureDTO toDTO(Facture facture) {
		return modelMapper.map(facture, FactureDTO.class);
	}

	public Facture fromDTO(FactureDTO dto) {
		return modelMapper.map(dto, Facture.class);
	}

	public List<FactureDTO> toListDTO(List<Facture> listFacture) {
		return listFacture.stream()
				.map(facture -> modelMapper.map(facture, FactureDTO.class))
				.collect(Collectors.toList());
	}
}