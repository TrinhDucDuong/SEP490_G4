package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.BannerOutputData;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class BannerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BannerInputBoundary bannerInputBoundary;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public BannerInputBoundary bannerInputBoundary() {
            return Mockito.mock(BannerInputBoundary.class);
        }
    }

    @Test
    void testGetAllBanners() throws Exception {
        BannerOutputData mockOutput = BannerOutputData.builder()
                .bannerImages(List.of(
                        Image.builder().imageUrl("https://example.com/banner1.jpg").build(),
                        Image.builder().imageUrl("https://example.com/banner2.jpg").build()
                ))
                .build();

        when(bannerInputBoundary.getAll()).thenReturn(mockOutput);
        mockMvc.perform(get("/banner"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bannerImages[0].imageUrl").value("https://example.com/banner1.jpg"))
                .andExpect(jsonPath("$.bannerImages[1].imageUrl").value("https://example.com/banner2.jpg"));
    }

    @Test
    void testGetAllBanners_EmptyList() throws Exception {
        BannerOutputData mockOutput = BannerOutputData.builder()
                .bannerImages(List.of())
                .build();

        when(bannerInputBoundary.getAll()).thenReturn(mockOutput);

        mockMvc.perform(get("/banner"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bannerImages").isArray())
                .andExpect(jsonPath("$.bannerImages").isEmpty());
    }

    @Test
    void testGetAllBanners_SingleBanner() throws Exception {
        BannerOutputData mockOutput = BannerOutputData.builder()
                .bannerImages(List.of(
                        Image.builder().imageUrl("https://example.com/single.jpg").build()
                ))
                .build();

        when(bannerInputBoundary.getAll()).thenReturn(mockOutput);

        mockMvc.perform(get("/banner"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bannerImages[0].imageUrl").value("https://example.com/single.jpg"));
    }

    @Test
    void testGetAllBanners_NullResponse() throws Exception {
        when(bannerInputBoundary.getAll()).thenReturn(null);

        mockMvc.perform(get("/banner"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bannerImages").doesNotExist());
    }

    @Test
    void testGetAllBanners_ServiceThrowsException() throws Exception {
        when(bannerInputBoundary.getAll()).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/banner"))
                .andExpect(status().isBadRequest());
    }
}
