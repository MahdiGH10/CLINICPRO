package com.ClinicPRO.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ClinicPRO.dto.PatientDTO;
import com.ClinicPRO.entities.Patient;

@Component
public class PatientMapper {

	@Autowired
	private ModelMapper modelMapper;

	public PatientDTO toDTO(Patient patient) {
		return modelMapper.map(patient, PatientDTO.class);
	}

	public Patient fromDTO(PatientDTO dto) {
		return modelMapper.map(dto, Patient.class);
	}

	public List<PatientDTO> toListDTO(List<Patient> listPatient) {
		return listPatient.stream()
				.map(patient -> modelMapper.map(patient, PatientDTO.class))
				.collect(Collectors.toList());
	}
}