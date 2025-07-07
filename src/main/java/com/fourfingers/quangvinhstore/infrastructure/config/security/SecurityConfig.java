package com.fourfingers.quangvinhstore.infrastructure.config.security;

import com.fourfingers.quangvinhstore.infrastructure.config.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
//@EnableWebSecurity
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    @Order(1)
    public SecurityFilterChain googleSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/auth/social/google/**", "/login/oauth2/code/google/**", "/oauth2/authorization/google/**")
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/auth/social/google/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2Login(auth -> auth
                        .loginPage("/oauth2/authorization/google")
                        .defaultSuccessUrl("/auth/social/google", true)
//                        .failureUrl("/auth/login?error=true")
                )
                .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain facebookSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/auth/social/facebook/**", "/login/oauth2/code/facebook/**", "/oauth2/authorization/facebook/**")
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/auth/social/facebook/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2Login(auth -> auth
                                .loginPage("/oauth2/authorization/facebook")
                                .defaultSuccessUrl("/auth/social/facebook", true)
//                        .failureUrl("/auth/login?error=true")
                )
                .build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(form -> {
                    form.loginPage("/auth/login").disable();
                    form.loginProcessingUrl("/auth/login").permitAll();
                })
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/auth/**").permitAll();
                    auth.requestMatchers("/home").permitAll();
                    auth.requestMatchers(HttpMethod.GET,"/policy").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/policy").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/policy/**").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/policy/**").permitAll();
                    auth.requestMatchers(HttpMethod.DELETE, "/policy/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/about-us").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/staff/**").permitAll();
                    auth.requestMatchers(HttpMethod.DELETE, "/staff/**").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/staff/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/store").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/store/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/instruction").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/home").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/product").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/product/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/admin/account").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/admin/account/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/admin/account").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/brand").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/blog").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/category").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/star-rate").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/banner").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/feedback").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/order").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/product/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/product").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/category").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/category/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/staff/category").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/profile").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/profile").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/signup").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/images/**").permitAll();
                    auth.requestMatchers("/admin/sns/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/sns/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/cart/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/cart/**").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/cart/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/staff/product").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/color").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/staff/brand").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "staff/brand/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "admin/staff").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/chatbot/new").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/recommendation").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/blog/**").permitAll();
                    auth.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll();
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5182"); // Allow your frontend origin
        configuration.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, etc.)
        configuration.addAllowedHeader("*"); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials (e.g., cookies, Authorization headers)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
