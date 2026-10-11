package com.projeto.UnitOdonto.dto;

import java.time.LocalDateTime;

public record ConsultaResponse(
		Long id,
		String dentista,
		String especializacao,
		LocalDateTime dataHora,
		String procedimento,
		String unidade,
		boolean agendada) {
}