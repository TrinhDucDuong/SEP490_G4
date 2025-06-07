package com.fourfingers.quangvinhstore.usecase.boundary;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtUtilBoundary {
    String generateToken(UserDetails userDetails);
    String getUsername(String token);
    boolean validateToken(String token);
}
