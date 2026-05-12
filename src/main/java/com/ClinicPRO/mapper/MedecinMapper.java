package com.ClinicPRO.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ClinicPRO.dto.MedecinDTO;
import com.ClinicPRO.entities.Medecin;

@Component
public class MedecinMapper {

	@Autowired
	private ModelMapper modelMapper;

	public MedecinDTO toDTO(Medecin medecin) {
		return modelMapper.map(medecin, MedecinDTO.class);
	}

	public Medecin fromDTO(MedecinDTO dto) {
		return modelMapper.map(dto, Medecin.class);
	}

	public List<MedecinDTO> toListDTO(List<Medecin> listMedecin) {
		return listMedecin.stream()
				.map(medecin -> modelMapper.map(medecin, MedecinDTO.class))
				.collect(Collectors.toList());
	}
}
