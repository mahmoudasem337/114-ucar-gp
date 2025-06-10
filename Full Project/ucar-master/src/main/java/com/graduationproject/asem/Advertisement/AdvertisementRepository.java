package com.graduationproject.asem.Advertisement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement,Long> {
    List<Advertisement> findAllByOwner(String owner); // Updated owner type to String
}
