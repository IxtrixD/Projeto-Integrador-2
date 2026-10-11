package com.projeto.UnitOdonto.config;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.projeto.UnitOdonto.model.Usuario;
import com.projeto.UnitOdonto.repository.UsuarioRepository;

@Configuration
public class BootstrapUserConfig {

	@Bean
	ApplicationRunner bootstrapUser(
			UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder,
			@Value("${app.bootstrap.username:}") String username,
			@Value("${app.bootstrap.password:}") String password) {
		return args -> {
			if (username.isBlank() || password.isBlank()) {
				return;
			}

			String normalizedUsername = username.trim().toLowerCase(Locale.ROOT);
			if (!usuarioRepository.existsByUsername(normalizedUsername)) {
				usuarioRepository.save(new Usuario(normalizedUsername, passwordEncoder.encode(password)));
			}
		};
	}
}