package com.projeto.UnitOdonto.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.projeto.UnitOdonto.model.Consulta;
import com.projeto.UnitOdonto.repository.ConsultaRepository;

@SpringBootTest
@AutoConfigureMockMvc
class AgendamentoControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ConsultaRepository consultaRepository;

	private Long consultaId;

	@BeforeEach
	void prepararDados() {
		consultaRepository.deleteAll();

		Consulta consulta = consultaRepository.save(new Consulta(
				"Dra. Marina Costa",
				"Clínica geral",
				LocalDateTime.now().plusDays(2).withHour(9).withMinute(30).withSecond(0).withNano(0),
				"Limpeza e prevenção",
				"Unidade Centro"));
		consultaId = consulta.getId();
	}

	@Test
	void pacientePodeAgendarECancelarConsulta() throws Exception {
		MockHttpSession session = iniciarSessao();

		mockMvc.perform(get("/api/agendamentos/horarios").session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].dentista").value("Dra. Marina Costa"))
				.andExpect(jsonPath("$[0].agendada").value(false));

		mockMvc.perform(post("/api/agendamentos/{id}", consultaId).session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.agendada").value(true));

		mockMvc.perform(get("/api/agendamentos/horarios").session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].agendada").value(true));

		mockMvc.perform(delete("/api/agendamentos/{id}", consultaId).session(session))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/agendamentos/horarios").session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].agendada").value(false));
	}

	@Test
	void horariosExigemSessaoAutenticada() throws Exception {
		mockMvc.perform(get("/api/agendamentos/horarios"))
				.andExpect(status().isUnauthorized());
	}

	private MockHttpSession iniciarSessao() throws Exception {
		MvcResult result = mockMvc.perform(post("/login")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"username\":\"paciente@unitodonto.com\",\"password\":\"12345678\"}"))
				.andExpect(status().isOk())
				.andReturn();
		return (MockHttpSession) result.getRequest().getSession(false);
	}
}