package com.graduationproject.asem.recommendation;

import com.graduationproject.asem.Advertisement.Advertisement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {

    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Value("${recommendation.service.url}")
    private String recommendationServiceBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final SearchLogService searchLogService;

    public SearchController(SearchLogService searchLogService) {
        this.searchLogService = searchLogService;
    }


    @PostMapping
    public ResponseEntity<List<Advertisement>> search(@RequestBody SearchRequest req) {
        // 1. Save the search log
        searchLogService.logSearch(req.getUserId(), req.getSearchQuery());

        // 2. Build the full FastAPI URL from the injected base
        String apiUrl = recommendationServiceBaseUrl + "/recommend/" + req.getUserId();

        try {
            // 3. Call FastAPI
            ResponseEntity<List<Advertisement>> response =
                    restTemplate.exchange(
                            apiUrl,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<Advertisement>>() {}
                    );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                logger.warn("FastAPI returned {} for userId {}", response.getStatusCode(), req.getUserId());
                return ResponseEntity.status(response.getStatusCode()).build();
            }
        } catch (RestClientException e) {
            logger.error("Error contacting FastAPI at {}", apiUrl, e);
            return ResponseEntity.status(503).build();
        }

    }

    @GetMapping("/ping-recommend")
    public ResponseEntity<String> pingRecommend() {
        String url = recommendationServiceBaseUrl + "/recommend/1";
        logger.info("Pinging FastAPI at {}", url);
        try {
            String body = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok("FastAPI says: " + body);
        } catch (Exception e) {
            logger.error("Ping failed", e);
            return ResponseEntity.status(503).body("Ping error: " + e.getMessage());
        }
    }
}