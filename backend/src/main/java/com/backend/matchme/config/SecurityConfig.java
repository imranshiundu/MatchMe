package com.backend.matchme.config;

import com.backend.matchme.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
 * New config bean for BCrypt so we can inject cleanly to userService
 * makes it a reusable encoder.
 * */

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    //disable security features:
    //permitAll lets you hit any hitpoint without auth
    //csrf.disable makes it possible to send POST/PUT without csrf token
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)        // disable CSRF = Cross-Site Request Forgery. not needed when we use JWT because we are stateless.
                .authorizeHttpRequests(auth -> auth.
                        //TODO: remove /users from allowed endpoints later on.
                        requestMatchers("/login", "/users/register", "/users/users") //these endpoints are allowed without authentication
                        .permitAll()
                        .anyRequest()//anything that comes after those, needs authentication token.
                        .authenticated());
        //              .permitAll() to enable every endpoint without securing for testing purposes
        //              .authenticated() to secure all endpoints.

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
