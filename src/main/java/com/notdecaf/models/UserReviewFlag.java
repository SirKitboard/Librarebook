package com.notdecaf.models;

import javax.persistence.*;

/**
 * Created by purav on 3/28/16.
 */
@Entity
public class UserReviewFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "review_id")
    private Review review;

    public UserReviewFlag() {
    }

    public UserReviewFlag(User user, Review review) {
        this.user = user;
        this.review = review;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }
}
