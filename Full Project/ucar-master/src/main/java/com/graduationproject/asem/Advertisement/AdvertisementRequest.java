package com.graduationproject.asem.Advertisement;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class AdvertisementRequest {
    private String ownerLocation;
    private String ownerPhoneNumber;
    private String carDescription;
    private BigDecimal carPrice;
    private String carModel;
    private String carMake;
    private int carProductionYear;
    private String carBodyType;
    private String carFuelType;
    private String carTransmissionType;
    private String carColor;
    private BigDecimal engineCapacity;
    private BigDecimal kilometers;
    private List<MultipartFile> images;
    private String ownerName;

    public AdvertisementRequest() {
    }

    public AdvertisementRequest(String ownerName,String ownerLocation, String ownerPhoneNumber, String carDescription, BigDecimal carPrice, String carModel, String carMake, int carProductionYear, String carBodyType, String carFuelType, String carTransmissionType, String carColor, BigDecimal engineCapacity, BigDecimal kilometers, List<MultipartFile> images) {
        this.ownerName = ownerName;
        this.ownerLocation = ownerLocation;
        this.ownerPhoneNumber = ownerPhoneNumber;
        this.carDescription = carDescription;
        this.carPrice = carPrice;
        this.carModel = carModel;
        this.carMake = carMake;
        this.carProductionYear = carProductionYear;
        this.carBodyType = carBodyType;
        this.carFuelType = carFuelType;
        this.carTransmissionType = carTransmissionType;
        this.carColor = carColor;
        this.engineCapacity = engineCapacity;
        this.kilometers = kilometers;
        this.images = images;
    }

    public String getOwnerLocation() {
        return ownerLocation;
    }

    public void setOwnerLocation(String ownerLocation) {
        this.ownerLocation = ownerLocation;
    }

    public String getOwnerPhoneNumber() {
        return ownerPhoneNumber;
    }

    public void setOwnerPhoneNumber(String ownerPhoneNumber) {
        this.ownerPhoneNumber = ownerPhoneNumber;
    }

    public String getCarDescription() {
        return carDescription;
    }

    public void setCarDescription(String carDescription) {
        this.carDescription = carDescription;
    }

    public BigDecimal getCarPrice() {
        return carPrice;
    }

    public void setCarPrice(BigDecimal carPrice) {
        this.carPrice = carPrice;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getCarMake() {
        return carMake;
    }

    public void setCarMake(String carMake) {
        this.carMake = carMake;
    }

    public int getCarProductionYear() {
        return carProductionYear;
    }

    public void setCarProductionYear(int carProductionYear) {
        this.carProductionYear = carProductionYear;
    }

    public String getCarFuelType() {
        return carFuelType;
    }

    public void setCarFuelType(String carFuelType) {
        this.carFuelType = carFuelType;
    }

    public String getCarBodyType() {
        return carBodyType;
    }

    public void setCarBodyType(String carBodyType) {
        this.carBodyType = carBodyType;
    }

    public String getCarTransmissionType() {
        return carTransmissionType;
    }

    public void setCarTransmissionType(String carTransmissionType) {
        this.carTransmissionType = carTransmissionType;
    }

    public BigDecimal getEngineCapacity() {
        return engineCapacity;
    }

    public void setEngineCapacity(BigDecimal engineCapacity) {
        this.engineCapacity = engineCapacity;
    }

    public String getCarColor() {
        return carColor;
    }

    public void setCarColor(String carColor) {
        this.carColor = carColor;
    }

    public BigDecimal getKilometers() {
        return kilometers;
    }

    public void setKilometers(BigDecimal kilometers) {
        this.kilometers = kilometers;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

}
/*
{
  "ownerlocation": "Sohag",
  "ownerphonenumber": "01155128905",
  "cardescription": "very good car for sell",
  "carprice": 25000.00,
  "carmodel": "320",
  "carmake": "BMW",
  "carproductionyear": 2018,
  "carbodytype": "Sedan",
  "carfueltype": "Petrol",
  "cartransmissiontype": "Automatic",
  "carcolor": "Black",
  "enginecapacity": 2.5,
  "kilometers": 15000.00
}
 */