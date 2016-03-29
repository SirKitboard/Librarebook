package com.notdecaf.models;

import com.notdecaf.helpers.PasswordStorage;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

/**
 * Created by halaamenasy on 3/28/16.
 */
@DiscriminatorValue("moderator")
@Entity
public class Moderator extends User{
    public Moderator(String firstName, String lastName, Date dob, String email, String gender, String password, Address address) throws PasswordStorage.CannotPerformOperationException {
        super(firstName, lastName, dob, email, gender, password,address);
    }

    public Moderator() {
    }
}
