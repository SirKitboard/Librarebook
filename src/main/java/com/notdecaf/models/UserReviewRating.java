package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by purav on 3/28/16.
 */

@Entity
public class UserReviewRating {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @NotNull
    private double rating;

    @JsonBackReference
    @ManyToOne
    @JoinTable(name="review_ratings", joinColumns = {@JoinColumn(name = "reviewID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(name = "ratingID", referencedColumnName = "id")})
    private Review review;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public UserReviewRating() {
    }

    public UserReviewRating(double rating, Review review, User user) {
        this.rating = rating;
        this.review = review;
        this.user = user;
    }

    public long getId() {
        return Id;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
