package com.fourfingers.quangvinhstore;

import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.AuthorityEntity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class QuangvinhstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuangvinhstoreApplication.class, args);
	}

}
