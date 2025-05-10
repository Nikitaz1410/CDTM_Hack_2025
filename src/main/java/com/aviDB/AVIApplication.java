package com.aviDB;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.io.PrintStream;
import java.util.logging.Logger;

@SpringBootApplication(scanBasePackages = "com.aviDB")
@EnableJpaRepositories(basePackages = "com.aviDB.repository")
@EntityScan(basePackages = "com.aviDB.domain")
public class
AVIApplication {

    private static final Logger logger = Logger.getLogger(AVIApplication.class.getName());
    private static boolean artDisplayed = false;

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(AVIApplication.class);
        app.setBanner(new SpadeArtBanner());
        app.run(args);
    }

    static class SpadeArtBanner implements Banner {
        @Override
        public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
            if (!artDisplayed) {
                out.println("""
                      AVI Health by Luca, Nikita, Sebastian and Daniel                           
                """);
                artDisplayed = true;
            }
        }
    }
}
