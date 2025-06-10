package com.graduationproject.asem.Advertisement;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class AdvertisementUpdateDto {
    private Long advertisementId;
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

    public AdvertisementUpdateDto() {
    }



    public Long getAdvertisementId() {
        return advertisementId;
    }

    public void setAdvertisementId(Long advertisementId) {
        this.advertisementId = advertisementId;
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

    public String getCarBodyType() {
        return carBodyType;
    }

    public void setCarBodyType(String carBodyType) {
        this.carBodyType = carBodyType;
    }

    public String getCarFuelType() {
        return carFuelType;
    }

    public void setCarFuelType(String carFuelType) {
        this.carFuelType = carFuelType;
    }

    public String getCarTransmissionType() {
        return carTransmissionType;
    }

    public void setCarTransmissionType(String carTransmissionType) {
        this.carTransmissionType = carTransmissionType;
    }

    public String getCarColor() {
        return carColor;
    }

    public void setCarColor(String carColor) {
        this.carColor = carColor;
    }

    public BigDecimal getEngineCapacity() {
        return engineCapacity;
    }

    public void setEngineCapacity(BigDecimal engineCapacity) {
        this.engineCapacity = engineCapacity;
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
}
