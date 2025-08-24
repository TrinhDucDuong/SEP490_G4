package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.data.admin.CustomerRegistedAccountOutputData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.fourfingers.quangvinhstore.usecase.boundary.AuthenticationInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling authentication-related operations.
 * Mapped to the "/auth" endpoint.
 *
 * @author LongLTHE170099
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthenticationController {
    private final AuthenticationInputBoundary authenticationInputBoundary;
    private final AuthenticationManager authenticationManager;

    /**
     * Authenticates a user and generates a JWT token.
     *
     * @param authenticationInputData The user credentials for authentication
     * @return ResponseEntity containing the authentication result with JWT token
     */
    @Operation(
            summary = "Authenticate user",
            description = "Authenticates user credentials and returns JWT token"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Successfully authenticated",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AuthenticationOutputData.class)
            )
    )
    @ApiResponse(
            responseCode = "401",
            description = "Invalid credentials"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Parameter(description = "User credentials") AuthenticationInputData authenticationInputData) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationInputData.getUsername(),
                        authenticationInputData.getPassword()
                )
        );
        AuthenticationOutputData authenticationOutputData = authenticationInputBoundary
                .performAuthentication(authenticationInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    /**
     * Registers a new user account.
     *
     * @param authenticationInputData The user registration details
     * @return ResponseEntity containing the registration result
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthenticationInputData authenticationInputData) {
        CustomerRegistedAccountOutputData customerRegistedAccountOutputData = authenticationInputBoundary
                .performSignupAuthentication(authenticationInputData);
        return ResponseEntity.ok(customerRegistedAccountOutputData);
    }

}

