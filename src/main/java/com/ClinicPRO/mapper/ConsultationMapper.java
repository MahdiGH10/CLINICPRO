package com.ClinicPRO.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ClinicPRO.dto.ConsultationDTO;
import com.ClinicPRO.entities.Consultation;

@Component
public class ConsultationMapper {

	@Autowired
	private ModelMapper modelMapper;

	public ConsultationDTO toDTO(Consultation consultation) {
		return modelMapper.map(consultation, ConsultationDTO.class);
	}

	public Consultation fromDTO(ConsultationDTO dto) {
		return modelMapper.map(dto, Consultation.class);
	}

	public List<ConsultationDTO> toListDTO(List<Consultation> listConsultation) {
		return listConsultation.stream()
				.map(c -> modelMapper.map(c, ConsultationDTO.class))
				.collect(Collectors.toList());
	}
}
