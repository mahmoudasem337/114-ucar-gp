package com.graduationproject.asem.PricePredictionModel;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class FastApiClient {

    RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://127.0.0.1:8000/predict/?method=xgboost";

    public FastApiResponse predictPrice(CarData carInput) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CarData> request = new HttpEntity<>(carInput, headers);
        ResponseEntity<FastApiResponse> response = restTemplate.postForEntity(FASTAPI_URL, request, FastApiResponse.class);
        double predictedPrice = response.getBody().getPredictedPrice();
        return new FastApiResponse(predictedPrice);
    }

}