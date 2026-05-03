package com.backend.matchme;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class MatchMeApplication {

    public static void main(String[] args) {
        // ensure the JVM default timezone is UTC so date/time handling is consistent
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        Dotenv dotenv = Dotenv.configure()
                .directory("backend") // backend folder
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(e ->
                System.setProperty(e.getKey(), e.getValue())
        );

        SpringApplication.run(MatchMeApplication.class, args);
    }
}
