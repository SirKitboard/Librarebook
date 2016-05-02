package com.notdecaf.models;

import com.notdecaf.helpers.EmailPreference;
import com.notdecaf.helpers.UserStatus;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@Table(name="user_preferences")
public class UserPreferences {
    @Id
    private long userID;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    private EmailPreference emailPreference;

    @NotNull
    private int checkoutLength;

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public long getUserID() {
        return userID;
    }

    public EmailPreference getEmailPreference() {
        return emailPreference;
    }

    public void setEmailPreference(EmailPreference emailPreference) {
        this.emailPreference = emailPreference;
    }

    public int getCheckoutLength() {
        return checkoutLength;
    }

    public void setCheckoutLength(int checkoutLength) {
        this.checkoutLength = checkoutLength;
    }

    public UserPreferences() {

    }
    public UserPreferences(User user) {
        this.userID = user.getId();
        this.status = UserStatus.Active;
        this.emailPreference = EmailPreference.HEAVY;
    }
}
