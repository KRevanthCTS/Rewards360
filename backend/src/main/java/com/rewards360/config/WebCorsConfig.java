
package com.rewards360.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:3000", // React (CRA/Next)
                                "http://localhost:5173", // React (Vite)
                                "http://localhost:5174"  // React (Vite alternate port)
                        )
                        .allowedMethods("GET","POST","PATCH","DELETE","OPTIONS","PUT")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
