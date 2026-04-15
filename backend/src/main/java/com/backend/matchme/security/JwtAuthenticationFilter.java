package com.backend.matchme.security;

import com.backend.matchme.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/* Spring Security expects an Authentication in its context
Many parts of Spring (method-level security, @PreAuthorize, @Secured, filters, etc.) check the SecurityContextHolder.
By creating a UsernamePasswordAuthenticationToken and setting it in the SecurityContext, you standardize how the app sees the user:
getPrincipal() → your user ID
getAuthorities() → user roles/permissions
JWT handles proof of identity (stateless, externalized).
Authentication handles identity within Spring Security (stateful per request).
 * */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter { //runs only once per EVERY http request to intercept request before controller
    private final AuthService authService;

    public JwtAuthenticationFilter(AuthService authService) {
        this.authService = authService;
    }

    //spring calls this method on every request. Everything to do with JWT happens here.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization"); // request = the incoming HTTP request object, getHeader grabs the value of the header with that name
        if (header == null || !header.startsWith("Bearer ")) { //JWT might not be present for public endpoints -- If header missing → we just let the request pass, security config will handle it later
            filterChain.doFilter(request, response); //Not all endpoints require login so we skip JWT logic.
            return;
        }
        final String token = header.substring(7); //we remove Bearer from our token (Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
        Long userId = authService.extractUserId(token);
        if (userId == null) {
            // Invalid token should not crash request handling; continue unauthenticated.
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList()); //we create new AuthToken which we later set in securityContextHolder so we can use it anywhere else in Spring system
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);// we pass this onto another filter in Spring Security system.

    }


}
