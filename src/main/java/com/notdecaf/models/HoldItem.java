package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by purav on 5/1/16.
 */
@Entity
public class HoldItem extends IDModel{
    @javax.persistence.Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @NotNull
    private Date dateHeld;

    public HoldItem() {
    }

    public HoldItem(User user, Item item) {
        this.user = user;
        this.item = item;
        this.dateHeld = new Date();
    }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
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

    public Date getDateHeld() {
        return dateHeld;
    }

    public void setDateHeld(Date dateHeld) {
        this.dateHeld = dateHeld;
    }
}
