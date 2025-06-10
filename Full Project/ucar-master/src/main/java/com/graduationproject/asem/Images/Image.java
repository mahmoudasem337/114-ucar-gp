package com.graduationproject.asem.Images;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.graduationproject.asem.Advertisement.Advertisement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "image")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String url;

    @ManyToOne
    @JoinColumn(name = "advertisement_id") // Matches the FK column in the DB
    @JsonIgnore // Prevent circular references during serialization
    private Advertisement advertisement;

    public Image() {
    }

    public Image(UUID id, String url, Advertisement advertisement) {
        this.id = id;
        this.url = url;
        this.advertisement = advertisement;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Advertisement getAdvertisement() {
        return advertisement;
    }

    public void setAdvertisement(Advertisement advertisement) {
        this.advertisement = advertisement;
    }
}