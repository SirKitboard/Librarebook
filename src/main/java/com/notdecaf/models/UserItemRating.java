package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by purav on 3/28/16.
 */
@Entity
public class UserItemRating extends IDModel{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @NotNull
    private int rating;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @OneToOne
    @JoinColumn(name = "review_id")
    private Review review;

    public UserItemRating() {
    }

    public UserItemRating(int rating, User user, Item item) {
        this.rating = rating;
        this.user = user;
        this.item = item;
    }

    public long getId() {
        return Id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public long getUser() {
        return user.getId();
    }

    public void setUser(User user) {
        this.user = user;
    }

    public long getItem() {
        return item.getId();
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }
}
