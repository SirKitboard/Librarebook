package com.notdecaf.models;

import javax.persistence.*;

/**
 * Created by Adi on 5/2/2016.
 */
@Entity
public class UserRecommendedBook {

    @javax.persistence.Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user", nullable = false)
    private User user;

    private long item;

    private String bookName;

    private String authorName;

    private int status;

    public UserRecommendedBook() {

    }

    public UserRecommendedBook(User user, long itemID) {
        this.user = user;
        this.item = itemID;
    }

    public UserRecommendedBook(User user, String bookName, String authorName) {
        this.user = user;
        this.bookName = bookName;
        this.authorName = authorName;
    }

    public long getId() {
        return Id;
    }

    public long getUser() {
        return user.getId();
    }

    public long getItem() {
        return item;
    }

    public void setItem(long item) {
        this.item = item;
    }

    public String getBookName() {
        return bookName;
    }


    public String getAuthorName() {
        return authorName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
