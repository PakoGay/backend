package com.example.literacy.curriculum;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.literacy.auth.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LessonCompletionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    @Test
    void shouldCompleteFirstSeededLesson() throws Exception {
        String accessToken = authService.login("parent@literacy.local", "Parent123!").accessToken();
        mockMvc.perform(post("/api/v1/lessons/1/complete")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"childId":1,"accuracy":0.95,"durationSeconds":55}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xpEarned").isNumber())
                .andExpect(jsonPath("$.stars").value(3));
    }
}
