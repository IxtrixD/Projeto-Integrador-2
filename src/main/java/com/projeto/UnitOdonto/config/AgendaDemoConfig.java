package com.projeto.UnitOdonto.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.projeto.UnitOdonto.model.Consulta;
import com.projeto.UnitOdonto.repository.ConsultaRepository;

@Configuration
public class AgendaDemoConfig {

	private static final List<Profissional> PROFISSIONAIS = List.of(
			new Profissional("Dra. Marina Costa", "Clínica geral", "Limpeza e prevenção"),
			new Profissional("Dr. Rafael Mendes", "Ortodontia", "Avaliação odontológica"),
			new Profissional("Dra. Luiza Prado", "Endodontia", "Consulta de rotina"));

	@Bean
	ApplicationRunner carregarHorariosDemonstracao(ConsultaRepository consultaRepository) {
		return args -> {
			if (consultaRepository.count() > 0) {
				return;
			}

			LocalDate data = LocalDate.now().plusDays(1);
			int diaUtil = 0;
			while (diaUtil < 15) {
				if (data.getDayOfWeek().getValue() <= 5) {
					for (int horario = 0; horario < 3; horario++) {
						Profissional profissional = PROFISSIONAIS.get((diaUtil + horario) % PROFISSIONAIS.size());
						LocalTime hora = switch (horario) {
							case 0 -> LocalTime.of(9, 30);
							case 1 -> LocalTime.of(11, 0);
							default -> LocalTime.of(15, 30);
						};
						consultaRepository.save(new Consulta(
								profissional.nome(),
								profissional.especializacao(),
								LocalDateTime.of(data, hora),
								profissional.procedimento(),
								"Unidade Centro"));
					}
					diaUtil++;
				}
				data = data.plusDays(1);
			}
		};
	}

	private record Profissional(String nome, String especializacao, String procedimento) {
	}
}