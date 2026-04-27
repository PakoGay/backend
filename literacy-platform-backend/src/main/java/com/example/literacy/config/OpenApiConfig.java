package com.example.literacy.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info()
                .title("Children's Literacy Learning Platform API")
                .version("v1")
                .description("Pre-defence backend API")
                .contact(new Contact().name("Children Literacy Platform")));
    }
}
