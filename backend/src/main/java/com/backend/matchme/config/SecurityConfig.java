package com.backend.matchme.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/*
 * New config bean for BCrypt so we can inject cleanly to userService
 * makes it a reusable encoder.
 * */

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    //disable security features:
    //permitAll lets you hit any hitpoint without auth
    //csrf.disable makes it possible to send POST/PUT without csrf token
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)        // disable CSRF = Cross-Site Request Forgery. not needed when we use JWT because we are stateless.
                .authorizeHttpRequests(auth -> auth.
                        //TODO: remove /users from allowed endpoints later on.
                        requestMatchers("/login", "/register", "/users") //these endpoints are allowed without authentication
                        .permitAll()
                        .anyRequest()//anything that comes after those, needs authentication token.
                        .authenticated());

        return http.build();
    }


}
