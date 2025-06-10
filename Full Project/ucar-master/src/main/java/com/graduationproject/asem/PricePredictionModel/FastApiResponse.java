package com.graduationproject.asem.PricePredictionModel;
import com.fasterxml.jackson.annotation.JsonProperty;
public class FastApiResponse {
    @JsonProperty("predicted_price")
    private double predictedPrice;

    public FastApiResponse() {
    }

    public FastApiResponse(double predictedPrice) {
        this.predictedPrice = predictedPrice;
    }

    public double getPredictedPrice() {
        return predictedPrice;
    }

    public void setPredictedPrice(double predictedPrice) {
        this.predictedPrice = predictedPrice;
    }
}

