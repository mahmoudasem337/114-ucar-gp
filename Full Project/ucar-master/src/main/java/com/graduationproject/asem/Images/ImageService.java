package com.graduationproject.asem.Images;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ImageService {

    private final CloudinaryService cloudinaryService;
    private final ImageRepository imageRepository;

    public ImageService(CloudinaryService cloudinaryService, ImageRepository imageRepository) {
        this.cloudinaryService = cloudinaryService;
        this.imageRepository = imageRepository;
    }

    public ResponseEntity<Map> uploadImage(ImageDto imagedto) {
        try {
            if (imagedto.getFile().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Image image = new Image();
            image.setUrl(cloudinaryService.uploadFile(imagedto.getFile(), "AdvertisementImages"));
            if(image.getUrl() == null) {
                return ResponseEntity.badRequest().build();
            }
            imageRepository.save(image);
            return ResponseEntity.ok().body(Map.of("url", image.getUrl()));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
