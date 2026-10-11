package com.projeto.UnitOdonto.controller;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void loginValidoCriaSessao() throws Exception {
		mockMvc.perform(post("/login")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"username\":\"paciente@unitodonto.com\",\"password\":\"12345678\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.username").value("paciente@unitodonto.com"))
				.andExpect(request().sessionAttribute("usuarioId", notNullValue()));
	}

	@Test
	void senhaInvalidaRetornaNaoAutorizado() throws Exception {
		mockMvc.perform(post("/login")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"username\":\"paciente@unitodonto.com\",\"password\":\"senha-errada\"}"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Usuário ou senha inválidos"));
	}

	@Test
	void paginaInternaRedirecionaQuandoNaoAutenticado() throws Exception {
		mockMvc.perform(get("/paginas/home.html"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/"));
	}

	@Test
	void endpointDeCredenciaisLocaisNaoExisteForaDoPerfilLocal() throws Exception {
		mockMvc.perform(get("/api/local-login"))
				.andExpect(status().isNotFound());
	}
}