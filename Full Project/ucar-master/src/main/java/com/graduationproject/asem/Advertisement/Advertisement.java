package com.graduationproject.asem.Advertisement;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.graduationproject.asem.Images.Image;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "advertisement")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long advertisementid;

    @Column(name = "owner")
    private String owner;

    @Column(name = "ownerlocation")
    private String ownerlocation;

    @Column(name = "ownerphonenumber")
    private String ownerphonenumber;

    @Column(name = "cardescription")
    private String cardescription;

    @Column(name = "carprice")
    private BigDecimal carprice;

    @Column(name = "carmodel")
    private String carmodel;

    @Column(name = "carmake")
    private String carmake;

    @Column(name = "carproductionyear")
    private int carproductionyear;

    @Column(name = "carbodytype")
    private String carbodytype;

    @Column(name = "carfueltype")
    private String carfueltype;

    @Column(name = "cartransmissiontype")
    private String cartransmissiontype;

    @Column(name = "carcolor")
    private String carcolor;

    @Column(name = "enginecapacity")
    private BigDecimal enginecapacity;

    @Column(name = "kilometers")
    private BigDecimal kilometers;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "advertisement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    public Advertisement() {
    }

    public Advertisement(Long advertisementid, String owner, String ownerlocation, String ownerphonenumber, String cardescription, BigDecimal carprice, String carmodel, String carmake, int carproductionyear, String carbodytype, String carfueltype, String cartransmissiontype, String carcolor, BigDecimal enginecapacity, BigDecimal kilometers, LocalDateTime createdAt, List<Image> images) {
        this.advertisementid = advertisementid;
        this.owner = owner;
        this.ownerlocation = ownerlocation;
        this.ownerphonenumber = ownerphonenumber;
        this.cardescription = cardescription;
        this.carprice = carprice;
        this.carmodel = carmodel;
        this.carmake = carmake;
        this.carproductionyear = carproductionyear;
        this.carbodytype = carbodytype;
        this.carfueltype = carfueltype;
        this.cartransmissiontype = cartransmissiontype;
        this.carcolor = carcolor;
        this.enginecapacity = enginecapacity;
        this.kilometers = kilometers;
        createdAt = createdAt;
        this.images = images;
    }

    public Long getAdvertisementid() {
        return advertisementid;
    }

    public void setAdvertisementid(Long advertisementid) {
        this.advertisementid = advertisementid;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getOwnerlocation() {
        return ownerlocation;
    }

    public void setOwnerlocation(String ownerlocation) {
        this.ownerlocation = ownerlocation;
    }

    public String getOwnerphonenumber() {
        return ownerphonenumber;
    }

    public void setOwnerphonenumber(String ownerphonenumber) {
        this.ownerphonenumber = ownerphonenumber;
    }

    public String getCardescription() {
        return cardescription;
    }

    public void setCardescription(String cardescription) {
        this.cardescription = cardescription;
    }

    public BigDecimal getCarprice() {
        return carprice;
    }

    public void setCarprice(BigDecimal carprice) {
        this.carprice = carprice;
    }

    public String getCarmodel() {
        return carmodel;
    }

    public void setCarmodel(String carmodel) {
        this.carmodel = carmodel;
    }

    public String getCarmake() {
        return carmake;
    }

    public void setCarmake(String carmake) {
        this.carmake = carmake;
    }

    public int getCarproductionyear() {
        return carproductionyear;
    }

    public void setCarproductionyear(int carproductionyear) {
        this.carproductionyear = carproductionyear;
    }

    public String getCarbodytype() {
        return carbodytype;
    }

    public void setCarbodytype(String carbodytype) {
        this.carbodytype = carbodytype;
    }

    public String getCartransmissiontype() {
        return cartransmissiontype;
    }

    public void setCartransmissiontype(String cartransmissiontype) {
        this.cartransmissiontype = cartransmissiontype;
    }

    public String getCarfueltype() {
        return carfueltype;
    }

    public void setCarfueltype(String carfueltype) {
        this.carfueltype = carfueltype;
    }

    public String getCarcolor() {
        return carcolor;
    }

    public void setCarcolor(String carcolor) {
        this.carcolor = carcolor;
    }

    public BigDecimal getEnginecapacity() {
        return enginecapacity;
    }

    public void setEnginecapacity(BigDecimal enginecapacity) {
        this.enginecapacity = enginecapacity;
    }

    public BigDecimal getKilometers() {
        return kilometers;
    }

    public void setKilometers(BigDecimal kilometers) {
        this.kilometers = kilometers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        createdAt = createdAt;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }
}
