package com.graduationproject.asem.recommendation;

import com.graduationproject.asem.User.User;
import org.antlr.v4.runtime.misc.NotNull;

public class SearchRequest {

    private User userId;

    private String searchQuery;

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public String getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }
}