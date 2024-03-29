package com.notdecaf;

import com.notdecaf.helpers.CheckoutManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LibrarebookApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibrarebookApplication.class, args);
	}
}
