package com.projeto.UnitOdonto.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.projeto.UnitOdonto.dto.ConsultaResponse;
import com.projeto.UnitOdonto.model.Consulta;
import com.projeto.UnitOdonto.model.Usuario;
import com.projeto.UnitOdonto.repository.ConsultaRepository;
import com.projeto.UnitOdonto.repository.UsuarioRepository;

@Service
public class AgendamentoService {

	private final ConsultaRepository consultaRepository;
	private final UsuarioRepository usuarioRepository;

	public AgendamentoService(ConsultaRepository consultaRepository, UsuarioRepository usuarioRepository) {
		this.consultaRepository = consultaRepository;
		this.usuarioRepository = usuarioRepository;
	}

	@Transactional(readOnly = true)
	public List<ConsultaResponse> listarHorarios(Long usuarioId) {
		return consultaRepository.findAllByDataHoraAfterOrderByDataHoraAsc(LocalDateTime.now()).stream()
				.filter(consulta -> consulta.getPaciente() == null || consulta.getPaciente().getId().equals(usuarioId))
				.map(consulta -> toResponse(consulta, usuarioId))
				.toList();
	}

	@Transactional
	public ConsultaResponse agendar(Long consultaId, Long usuarioId) {
		Consulta consulta = findForUpdate(consultaId);
		if (consulta.getDataHora().isBefore(LocalDateTime.now())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Este horário já passou.");
		}
		if (consulta.getPaciente() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Este horário não está mais disponível.");
		}

		Usuario paciente = usuarioRepository.findById(usuarioId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
		consulta.agendar(paciente);
		return toResponse(consultaRepository.save(consulta), usuarioId);
	}

	@Transactional
	public void cancelar(Long consultaId, Long usuarioId) {
		Consulta consulta = findForUpdate(consultaId);
		if (consulta.getPaciente() == null || !consulta.getPaciente().getId().equals(usuarioId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consulta não encontrada.");
		}
		consulta.cancelar();
	}

	private Consulta findForUpdate(Long consultaId) {
		return consultaRepository.findByIdForUpdate(consultaId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horário não encontrado."));
	}

	private ConsultaResponse toResponse(Consulta consulta, Long usuarioId) {
		boolean agendada = consulta.getPaciente() != null
				&& consulta.getPaciente().getId().equals(usuarioId);
		return new ConsultaResponse(
				consulta.getId(),
				consulta.getDentista(),
				consulta.getEspecializacao(),
				consulta.getDataHora(),
				consulta.getProcedimento(),
				consulta.getUnidade(),
				agendada);
	}
}