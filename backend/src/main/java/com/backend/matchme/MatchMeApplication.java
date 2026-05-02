package com.backend.matchme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class MatchMeApplication {

    public static void main(String[] args) {
        // ensure the JVM default timezone is UTC so date/time handling is consistent
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(MatchMeApplication.class, args);
    }
}
