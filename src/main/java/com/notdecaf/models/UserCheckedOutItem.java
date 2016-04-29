package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by Adi on 4/7/2016.
 */
@Entity
public class UserCheckedOutItem extends IDModel{

    @javax.persistence.Id
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

    @NotNull
    private Date dueDate;

    @NotNull
    private boolean renewed;

    @NotNull
    private boolean willRenew;

    public UserCheckedOutItem() {

    }

    public UserCheckedOutItem(User user, Item item, int checkoutLength) {
        this.user = user;
        this.item = item;
        this.renewed = false;
        this.willRenew = false;
        this.checkedOutOn = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(this.checkedOutOn);
        calendar.add(Calendar.DATE, checkoutLength);
        this.dueDate = new Date(calendar.getTimeInMillis());
    }

    public long getId() {
        return Id;
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

    public Date getCheckedOutOn() {
        return checkedOutOn;
    }

    public void setCheckedOutOn(Date checkedOutOn) {
        this.checkedOutOn = checkedOutOn;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isRenewed() {
        return renewed;
    }

    public void setRenewed(boolean renewed) {
        this.renewed = renewed;
    }

    public boolean getWillRenew() {
        return willRenew;
    }

    public void setRenew(boolean renew) {
        this.willRenew = renew;
    }
}
