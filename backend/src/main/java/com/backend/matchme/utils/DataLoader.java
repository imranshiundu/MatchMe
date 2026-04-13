package com.backend.matchme.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // Logic to drop/clear DB and seed 100+ fictitious users
        System.out.println("Seeding database with fictitious users...");
    }
}
