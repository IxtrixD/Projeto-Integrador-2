package com.projeto.UnitOdonto.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginRequiredInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		var session = request.getSession(false);
		if (session != null && session.getAttribute("usuarioId") != null) {
			return true;
		}

		response.sendRedirect("/");
		return false;
	}
}