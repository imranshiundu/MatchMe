package com.backend.matchme.config;

import com.backend.matchme.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    //disable security features:
    //permitAll lets you hit any hitpoint without auth
    //csrf.disable makes it possible to send POST/PUT without csrf token
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)// disable CSRF = Cross-Site Request Forgery. not needed when we use JWT because we are stateless.
                .formLogin(AbstractHttpConfigurer::disable) //don't redirect to /login because react handles it. Enables server side login flow.
                .httpBasic(AbstractHttpConfigurer::disable) //disable http basic authentication
                .logout(AbstractHttpConfigurer::disable) //backend is stateless and doesn't track sessions
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //no memory of login on the server between requests.
                .authorizeHttpRequests(auth -> auth.
                        //TODO: remove /users from allowed endpoints later on.
                                requestMatchers("/login", "/register", "/users", "/ws-chat/**") //these endpoints are allowed without authentication
                        .permitAll()
                        .anyRequest()//anything that comes after those, needs authentication token.
                        .authenticated());
        //              .permitAll() to enable every endpoint without securing for testing purposes
        //              .authenticated() to secure all endpoints.

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
