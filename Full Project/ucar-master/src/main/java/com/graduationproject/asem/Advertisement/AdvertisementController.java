package com.graduationproject.asem.Advertisement;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;
    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @CrossOrigin(origins = "http://localhost:5173") 
    @PostMapping(consumes = "multipart/form-data")
    public void addAdvertisement(@RequestPart(value = "advertisement", required = true) AdvertisementRequest advertisementRequest,
                                  @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        if (advertisementRequest == null) {
            throw new IllegalArgumentException("Required part 'advertisement' is not present.");
        }
        advertisementRequest.setImages(images);
        advertisementService.addAdvertisement(advertisementRequest);
    }

    @GetMapping
    public List<AdvertisementResponse> getAllAdvertisements() {
        return advertisementService.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteAdvertisement(@PathVariable Long id){
    advertisementService.DeleteAdvertisement(id);
    }

    @GetMapping("/{id}")
    public Optional<AdvertisementResponse> getAdvertisement(@PathVariable Long id){
        return advertisementService.getAdvertisementById(id);
    }

    @PutMapping
    public void updateAdvertisement(@RequestBody AdvertisementUpdateDto advertisementUpdateDto) {
        advertisementService.updateAdvertisement(advertisementUpdateDto);
    }
}
