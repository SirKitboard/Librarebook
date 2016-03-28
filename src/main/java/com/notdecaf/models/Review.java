package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by purav on 3/28/16.
 */
@Entity
@Table( name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String review;

    @NotNull
    private int flags;

//    @NotNull
//    @OneToOne(mappedBy = "reviews")
//    private UserItemRating itemRating;

//    @OneToOne
//    @JoinColumn(name = "RATING_ID")
//    private UserReviewRating reviewRating;

    public Review() {

    }

    public Review(String review) {
        this.review = review;
        this.flags = 0;
    }

    public long getId() {
        return id;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public int getFlags() {
        return flags;
    }

    public void setFlags(int flags) {
        this.flags = flags;
    }

//    public UserItemRating getItemRating() {
//        return itemRating;
//    }
//
//    public void setItemRating(UserItemRating itemRating) {
//        this.itemRating = itemRating;
//    }

//    public UserReviewRating getReviewRating() {
//        return reviewRating;
//    }
//
//    public void setReviewRating(UserReviewRating reviewRating) {
//        this.reviewRating = reviewRating;
//    }
}
