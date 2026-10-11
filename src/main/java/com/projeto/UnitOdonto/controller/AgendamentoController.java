package com.projeto.UnitOdonto.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.projeto.UnitOdonto.dto.ConsultaResponse;
import com.projeto.UnitOdonto.service.AgendamentoService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

	private final AgendamentoService agendamentoService;

	public AgendamentoController(AgendamentoService agendamentoService) {
		this.agendamentoService = agendamentoService;
	}

	@GetMapping("/horarios")
	public List<ConsultaResponse> listarHorarios(HttpSession session) {
		return agendamentoService.listarHorarios(usuarioId(session));
	}

	@PostMapping("/{consultaId}")
	public ConsultaResponse agendar(@PathVariable Long consultaId, HttpSession session) {
		return agendamentoService.agendar(consultaId, usuarioId(session));
	}

	@DeleteMapping("/{consultaId}")
	public ResponseEntity<Void> cancelar(@PathVariable Long consultaId, HttpSession session) {
		agendamentoService.cancelar(consultaId, usuarioId(session));
		return ResponseEntity.noContent().build();
	}

	private Long usuarioId(HttpSession session) {
		Object id = session.getAttribute("usuarioId");
		if (id instanceof Long usuarioId) {
			return usuarioId;
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Faça login para continuar.");
	}
}