package com.projeto.UnitOdonto.service;

import java.util.Locale;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projeto.UnitOdonto.dto.LoginRequest;
import com.projeto.UnitOdonto.model.Usuario;
import com.projeto.UnitOdonto.repository.UsuarioRepository;

@Service
public class AutenticacaoService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public AutenticacaoService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<Usuario> autenticar(LoginRequest request) {
		String username = request.username().trim().toLowerCase(Locale.ROOT);

		return usuarioRepository.findByUsername(username)
				.filter(usuario -> passwordEncoder.matches(request.password(), usuario.getPasswordHash()));
	}
}