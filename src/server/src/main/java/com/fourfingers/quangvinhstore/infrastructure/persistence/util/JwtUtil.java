package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.fourfingers.quangvinhstore.usecase.boundary.JwtUtilBoundary;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil implements JwtUtilBoundary {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    @Value("${app.jwt-secret}")
    private String secretKey;

    @Value("${app.jwt-expiration-milliseconds}")
    private Long expirationTime;

    @Override
    public String generateToken(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Date currentTime = new Date();
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(currentTime.getTime() + expirationTime))
                .signWith(key())
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    @Override
    // Get user name from JWT Token
    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    @Override
    // Validate JWT Token
    public boolean validateToken(String authToken) {
        Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parse(authToken);
        return true;
    }


}
