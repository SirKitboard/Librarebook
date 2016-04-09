package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by Adi on 4/7/2016.
 */
@Entity
public class UserCheckoutHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @NotNull
    private Date checkedOutOn;
    private Date returnedOn;

    public UserCheckoutHistory(User user, Item item) {
        this.user = user;
        this.item = item;
        this.checkedOutOn = new Date();
    }

    public long getId() {
        return Id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Date getCheckedOutOn() {
        return checkedOutOn;
    }

    public void setCheckedOutOn(Date checkedOutOn) {
        this.checkedOutOn = checkedOutOn;
    }

    public Date getReturnedOn() {
        return returnedOn;
    }

    public void setReturnedOn(Date returnedOn) {
        this.returnedOn = returnedOn;
    }
}
