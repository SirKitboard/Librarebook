package com.notdecaf.models;

import com.notdecaf.helpers.PasswordStorage;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

/**
 * Created by halaamenasy on 3/28/16.
 */
@Entity
@DiscriminatorValue("admin")
public class Admin extends Moderator {
    public Admin(String firstName, String lastName, Date dob, String email, String gender, String password) throws PasswordStorage.CannotPerformOperationException {
        super(firstName, lastName, dob, email, gender, password);
    }

    public Admin() {
    }
}
