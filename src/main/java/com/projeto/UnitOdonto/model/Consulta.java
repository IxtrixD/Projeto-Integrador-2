package com.projeto.UnitOdonto.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "consultas", uniqueConstraints = @UniqueConstraint(columnNames = { "dentista", "data_hora" }))
public class Consulta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 120)
	private String dentista;

	@Column(nullable = false, length = 120)
	private String especializacao;

	@Column(name = "data_hora", nullable = false)
	private LocalDateTime dataHora;

	@Column(nullable = false, length = 160)
	private String procedimento;

	@Column(nullable = false, length = 120)
	private String unidade;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id")
	private Usuario paciente;

	protected Consulta() {
	}

	public Consulta(String dentista, String especializacao, LocalDateTime dataHora, String procedimento, String unidade) {
		this.dentista = dentista;
		this.especializacao = especializacao;
		this.dataHora = dataHora;
		this.procedimento = procedimento;
		this.unidade = unidade;
	}

	public Long getId() {
		return id;
	}

	public String getDentista() {
		return dentista;
	}

	public String getEspecializacao() {
		return especializacao;
	}

	public LocalDateTime getDataHora() {
		return dataHora;
	}

	public String getProcedimento() {
		return procedimento;
	}

	public String getUnidade() {
		return unidade;
	}

	public Usuario getPaciente() {
		return paciente;
	}

	public void agendar(Usuario paciente) {
		this.paciente = paciente;
	}

	public void cancelar() {
		this.paciente = null;
	}
}