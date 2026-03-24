package com.backend.matchme.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Map;
/* What happens at runtime
 * Request comes in
 * Spring Security hits your filter
 * Your method runs
 * YOU  read JWT
 *      validate
 *      set authentication
 * Pass request forward
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
        String token = header.substring(7); //we remove Bearer from our token (Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
        extractAllClaims(token);
        filterChain.doFilter(request, response);
    }

    private Claims extractAllClaims(String token) {

        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes()); //convert our secret key to usable binary key(must match in AuthService).
            Jws<Claims> jwsClaims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);

            return jwsClaims.getBody();
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
}


