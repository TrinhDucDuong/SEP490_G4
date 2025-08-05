package com.fourfingers.quangvinhstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
public class QuangvinhstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuangvinhstoreApplication.class, args);
	}

}
