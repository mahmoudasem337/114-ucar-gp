package com.graduationproject.asem.PricePredictionModel;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/car")
public class CarController {

    private final FastApiClient fastApiClient;

    public CarController(FastApiClient fastApiClient) {
        this.fastApiClient = fastApiClient;
    }

    @PostMapping("/predictt")
    public FastApiResponse predictCarPrice(@RequestBody CarData carInput) {
        return fastApiClient.predictPrice(carInput);
    }
}
