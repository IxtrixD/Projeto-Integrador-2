package com.projeto.UnitOdonto.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.projeto.UnitOdonto.controller.LoginRequiredInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final LoginRequiredInterceptor loginRequiredInterceptor;

	public WebConfig(LoginRequiredInterceptor loginRequiredInterceptor) {
		this.loginRequiredInterceptor = loginRequiredInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(loginRequiredInterceptor).addPathPatterns("/paginas/**");
	}
}