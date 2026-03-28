package com.backend.matchme.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() { //Spring MVC is the part that handles HTTP requests.
            @Override //we override because we want to use these settings instead of default ones.
            public void addCorsMappings(CorsRegistry corsRegistry) {
                corsRegistry.addMapping("/**") //applies to all endpoints.
                        .allowedOrigins("http://localhost:5174") //this indicates react dev server.
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // indicates which methods are allowed.
                        .allowedHeaders("*") // indicates that all headers are allowed.
                        .allowCredentials(true); // this is required if using Authorization header.
            }
        };
    }

}
