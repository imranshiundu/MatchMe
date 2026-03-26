package com.backend.matchme.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Collections;
import java.util.function.Function;
/* Spring Security expects an Authentication in its context
Many parts of Spring (method-level security, @PreAuthorize, @Secured, filters, etc.) check the SecurityContextHolder.
By creating a UsernamePasswordAuthenticationToken and setting it in the SecurityContext, you standardize how the app sees the user:
getPrincipal() → your user ID
getAuthorities() → user roles/permissions
JWT handles proof of identity (stateless, externalized).
Authentication handles identity within Spring Security (stateful per request).
 * */

public class JwtAuthenticationFilter extends OncePerRequestFilter { //runs only once per EVERY http request to intercept request before controller
    @Value("${jwt.secret}")
    private String jwtSecret;


    //spring calls this method on every request. Everything to do with JWT happens here.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization"); // request = the incoming HTTP request object, getHeader grabs the value of the header with that name
        if (header == null || !header.startsWith("Bearer ")) { //JWT might not be present for public endpoints -- If header missing → we just let the request pass, security config will handle it later
            filterChain.doFilter(request, response); //Not all endpoints require login so we skip JWT logic.
            return;
        }
        final String token = header.substring(7); //we remove Bearer from our token (Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
        final Claims claims = extractAllClaims(token);
        //TODO: query the user again to check if user status is banned or something else before setting user Authentication as Authorized.
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(claims.getId(), null, Collections.emptyList()); //we create new AuthToken which we later set in securityContextHolder so we can use it anywhere else in Spring system
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);// we pass this onto another filter in Spring Security system.

    }

    private Claims extractAllClaims(String token) {

        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes()); //convert our secret key to usable binary key(must match in AuthService).
            Jws<Claims> jwsClaims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);

            return jwsClaims.getBody();

            //TODO: add 401 Unauthorized instead of print.
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired");
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported");
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty");
        }
        return null;
    }

    public String extractUsername(String token) { //Helper to get username from token.
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
}


