package com.graduationproject.asem.recommendation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.graduationproject.asem.User.User;

public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {
   List<SearchLog> findAllByUserId(User userId);
}
