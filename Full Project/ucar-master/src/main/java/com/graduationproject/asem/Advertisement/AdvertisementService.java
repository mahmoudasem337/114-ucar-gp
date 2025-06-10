package com.graduationproject.asem.Advertisement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.graduationproject.asem.Auth.AuthenticationService;
import com.graduationproject.asem.Images.CloudinaryService;
import com.graduationproject.asem.Images.Image;
import com.graduationproject.asem.User.UserService;

@Service
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final CloudinaryService imageStorageService;

    public AdvertisementService(AdvertisementRepository advertisementRepository, UserService userService, AuthenticationService authenticationService, CloudinaryService imageStorageService) {
        this.advertisementRepository = advertisementRepository;
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.imageStorageService = imageStorageService;
    }
    public Optional<UserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            return Optional.of((UserDetails) authentication.getPrincipal());
        }
        return Optional.empty();
    }
    public void addAdvertisement(AdvertisementRequest advertisement) {
        Advertisement advertisement1 = new Advertisement();
        advertisement1.setOwner(advertisement.getOwnerName()); // Set owner as String
        advertisement1.setOwnerlocation(advertisement.getOwnerLocation());
        advertisement1.setCarcolor(advertisement.getCarColor());
        advertisement1.setCarbodytype(advertisement.getCarBodyType());
        advertisement1.setCardescription(advertisement.getCarDescription());
        advertisement1.setCarmake(advertisement.getCarMake());
        advertisement1.setCarfueltype(advertisement.getCarFuelType());
        advertisement1.setCarmodel(advertisement.getCarModel());
        advertisement1.setCarprice(advertisement.getCarPrice());
        advertisement1.setCarproductionyear(advertisement.getCarProductionYear());
        advertisement1.setCartransmissiontype(advertisement.getCarTransmissionType());
        advertisement1.setOwnerphonenumber(advertisement.getOwnerPhoneNumber());
        advertisement1.setEnginecapacity(advertisement.getEngineCapacity());
        advertisement1.setKilometers(advertisement.getKilometers());
        advertisement1.setCreatedAt(LocalDateTime.now());
        if (advertisement1.getImages() == null) {
            advertisement1.setImages(new ArrayList<>());
        }
        if (advertisement.getImages() != null && !advertisement.getImages().isEmpty()) {
            List<Image> Images = advertisement.getImages().stream()
                    .map(file -> {
                        String imageUrl = imageStorageService.uploadFile(file, "AdvertisementImages");
                        Image image = new Image();
                        image.setUrl(imageUrl);
                        image.setAdvertisement(advertisement1);
                        return image;
                    })
                    .collect(Collectors.toList());
            advertisement1.getImages().addAll(Images);
        }
        advertisementRepository.save(advertisement1);
    }

    public void DeleteAdvertisement(Long id) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found"));
        advertisementRepository.delete(advertisement);
    }

    public List<AdvertisementResponse> findAll() {
        List<Advertisement> advertisements = advertisementRepository.findAll();
        return advertisements.stream().map(advertisement -> {
                    AdvertisementResponse response = new AdvertisementResponse();
                    response.setAdvertisementId(advertisement.getAdvertisementid());
                    response.setOwnerName(advertisement.getOwner()); // Owner is now a String
                    response.setOwnerLocation(advertisement.getOwnerlocation());
                    response.setOwnerPhoneNumber(advertisement.getOwnerphonenumber());
                    response.setCarDescription(advertisement.getCardescription());
                    response.setCarPrice(advertisement.getCarprice());
                    response.setCarModel(advertisement.getCarmodel());
                    response.setCarMake(advertisement.getCarmake());
                    response.setCarProductionYear(advertisement.getCarproductionyear());
                    response.setCarBodyType(advertisement.getCarbodytype());
                    response.setCarFuelType(advertisement.getCarfueltype());
                    response.setCarTransmissionType(advertisement.getCartransmissiontype());
                    response.setCarColor(advertisement.getCarcolor());
                    response.setEngineCapacity(advertisement.getEnginecapacity());
                    response.setKilometers(advertisement.getKilometers());
                    response.setCreatedAt(advertisement.getCreatedAt());
                    response.setImageUrls(advertisement.getImages());
                    return response;
                }
        ).collect(Collectors.toList());
    }

    public Optional<AdvertisementResponse> getAdvertisementById(Long id) {
        Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found"));
        AdvertisementResponse response = new AdvertisementResponse();
        response.setAdvertisementId(advertisement.getAdvertisementid());
        response.setOwnerName(advertisement.getOwner()); // Owner is now a String
        response.setOwnerLocation(advertisement.getOwnerlocation());
        response.setOwnerPhoneNumber(advertisement.getOwnerphonenumber());
        response.setCarDescription(advertisement.getCardescription());
        response.setCarPrice(advertisement.getCarprice());
        response.setCarModel(advertisement.getCarmodel());
        response.setCarMake(advertisement.getCarmake());
        response.setCarProductionYear(advertisement.getCarproductionyear());
        response.setCarBodyType(advertisement.getCarbodytype());
        response.setCarFuelType(advertisement.getCarfueltype());
        response.setCarTransmissionType(advertisement.getCartransmissiontype());
        response.setCarColor(advertisement.getCarcolor());
        response.setEngineCapacity(advertisement.getEnginecapacity());
        response.setKilometers(advertisement.getKilometers());
        response.setCreatedAt(advertisement.getCreatedAt());
        response.setImageUrls(advertisement.getImages());
        return Optional.of(response);
    }

    public void updateAdvertisement(AdvertisementUpdateDto request) {
        Advertisement advertisement = advertisementRepository.findById(request.getAdvertisementId()).get();
        String currentUsername = authenticationService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("You can't update this advertisement")).getUsername();
        String ownerEmail = advertisement.getOwner(); // Owner is now a String
        if (currentUsername.equals(ownerEmail)) {
            // If user is the owner, delete the advertisement
            advertisement.setOwnerlocation(request.getOwnerLocation());
            advertisement.setOwnerphonenumber(request.getOwnerPhoneNumber());
            advertisement.setCardescription(request.getCarDescription());
            advertisement.setCarprice(request.getCarPrice());
            advertisement.setCarmodel(request.getCarModel());
            advertisement.setCarmake(request.getCarMake());
            advertisement.setCarproductionyear(request.getCarProductionYear());
            advertisement.setCarbodytype(request.getCarBodyType());
            advertisement.setCarfueltype(request.getCarFuelType());
            advertisement.setCartransmissiontype(request.getCarTransmissionType());
            advertisement.setCarcolor(request.getCarColor());
            advertisement.setEnginecapacity(request.getEngineCapacity());
            advertisement.setKilometers(request.getKilometers());
            List<Image> Images = request.getImages().stream()
                    .map(file -> {
                        String imageUrl = imageStorageService.uploadFile(file, "AdvertisementImages");
                        Image image = new Image();
                        image.setUrl(imageUrl);
                        image.setAdvertisement(advertisement);
                        return image;
                    })
                    .collect(Collectors.toList());
            advertisement.getImages().addAll(Images);
            advertisementRepository.save(advertisement);
        } else {
            // If user is not the owner, throw an exception
            throw new RuntimeException("You are not authorized to update this advertisement");
        }
    }
}

