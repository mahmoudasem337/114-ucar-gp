package com.graduationproject.asem.recommendation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.graduationproject.asem.User.User;

@Service
public class SearchLogService {

    @Autowired
    private SearchLogRepository searchLogRepository;

    public SearchLog logSearch(User userId, String searchQuery) {
        SearchLog log = new SearchLog(userId, searchQuery, LocalDateTime.now());
        return searchLogRepository.save(log);
    }
    public List<SearchLog> getallbyuserid(User id){
        return searchLogRepository.findAllByUserId(id);
    }
}