package com.graduationproject.asem.recommendation;

import com.graduationproject.asem.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {
   List<SearchLog> findAllByUserId(User userId);
}
