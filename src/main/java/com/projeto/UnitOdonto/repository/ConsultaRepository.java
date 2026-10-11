package com.projeto.UnitOdonto.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projeto.UnitOdonto.model.Consulta;

import jakarta.persistence.LockModeType;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
	List<Consulta> findAllByDataHoraAfterOrderByDataHoraAsc(LocalDateTime dataHora);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select consulta from Consulta consulta where consulta.id = :id")
	Optional<Consulta> findByIdForUpdate(@Param("id") Long id);
}