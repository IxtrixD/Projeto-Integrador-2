package com.projeto.UnitOdonto.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.UnitOdonto.dto.LocalLoginCredentialsResponse;

@RestController
@Profile("local")
public class LocalLoginController {

	private final String username;
	private final String password;

	public LocalLoginController(
			@Value("${app.bootstrap.username}") String username,
			@Value("${app.bootstrap.password}") String password) {
		this.username = username;
		this.password = password;
	}

	@GetMapping("/api/local-login")
	public ResponseEntity<LocalLoginCredentialsResponse> credentials() {
		return ResponseEntity.ok()
				.cacheControl(CacheControl.noStore())
				.body(new LocalLoginCredentialsResponse(username, password));
	}
}