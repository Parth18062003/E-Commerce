package com.hypehouse.product_service.algolia;

import com.algolia.search.SearchClient;
import com.algolia.search.DefaultSearchClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class AlgoliaConfig {

    @Value("${algolia.application-id}")
    private String appId;

    @Value("${algolia.api-key}")
    private String apiKey;

    @Bean
    public SearchClient searchClient() {
        return DefaultSearchClient.create(appId, apiKey);
    }
}
