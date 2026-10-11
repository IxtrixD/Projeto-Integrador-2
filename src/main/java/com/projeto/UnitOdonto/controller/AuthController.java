package com.projeto.UnitOdonto.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.UnitOdonto.dto.LoginRequest;
import com.projeto.UnitOdonto.dto.LoginResponse;
import com.projeto.UnitOdonto.service.AutenticacaoService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
public class AuthController {

	private final AutenticacaoService autenticacaoService;

	public AuthController(AutenticacaoService autenticacaoService) {
		this.autenticacaoService = autenticacaoService;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
		return autenticacaoService.autenticar(request)
				.map(usuario -> {
					session.setAttribute("usuarioId", usuario.getId());
					return ResponseEntity.ok(new LoginResponse("Login efetuado com sucesso", usuario.getUsername()));
				})
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new LoginResponse("Usuário ou senha inválidos", null)));
	}
}