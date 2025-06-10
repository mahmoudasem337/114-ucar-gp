package com.graduationproject.asem.PricePredictionModel;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CarData {
    @JsonProperty("Brand")
    private String Brand;
    @JsonProperty("Model")
    private String Model;
    @JsonProperty("Year")
    private int Year;
    @JsonProperty("Engine_CC")
    private int Engine_CC;
    @JsonProperty("Kilometers_Driven")
    private int Kilometers_Driven;
    @JsonProperty("Transmission")
    private String Transmission;
    @JsonProperty("COMMON_PROBLEM")
    private String COMMON_PROBLEM;
    @JsonProperty("Body")
    private String Body;
    @JsonProperty("Fuel")
    private String Fuel;
    @JsonProperty("Color")
    private String Color;
    @JsonProperty("City")
    private String City;

    public CarData() {
    }

    public CarData(String brand, String model, int year, int engine_CC, int kilometers_Driven, String transmission, String COMMON_PROBLEM, String body, String fuel, String color, String city) {
        Brand = brand;
        Model = model;
        Year = year;
        Engine_CC = engine_CC;
        Kilometers_Driven = kilometers_Driven;
        Transmission = transmission;
        this.COMMON_PROBLEM = COMMON_PROBLEM;
        Body = body;
        Fuel = fuel;
        Color = color;
        City = city;
    }

    public String getBrand() {
        return Brand;
    }

    public void setBrand(String brand) {
        Brand = brand;
    }

    public String getModel() {
        return Model;
    }

    public void setModel(String model) {
        Model = model;
    }

    public int getYear() {
        return Year;
    }

    public void setYear(int year) {
        Year = year;
    }

    public int getEngine_CC() {
        return Engine_CC;
    }

    public void setEngine_CC(int engine_CC) {
        Engine_CC = engine_CC;
    }

    public int getKilometers_Driven() {
        return Kilometers_Driven;
    }

    public void setKilometers_Driven(int kilometers_Driven) {
        Kilometers_Driven = kilometers_Driven;
    }

    public String getTransmission() {
        return Transmission;
    }

    public void setTransmission(String transmission) {
        Transmission = transmission;
    }

    public String getCOMMON_PROBLEM() {
        return COMMON_PROBLEM;
    }

    public void setCOMMON_PROBLEM(String COMMON_PROBLEM) {
        this.COMMON_PROBLEM = COMMON_PROBLEM;
    }

    public String getBody() {
        return Body;
    }

    public void setBody(String body) {
        Body = body;
    }

    public String getFuel() {
        return Fuel;
    }

    public void setFuel(String fuel) {
        Fuel = fuel;
    }

    public String getColor() {
        return Color;
    }

    public void setColor(String color) {
        Color = color;
    }

    public String getCity() {
        return City;
    }

    public void setCity(String city) {
        City = city;
    }
}
