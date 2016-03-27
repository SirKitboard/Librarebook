package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
/**
 * Created by Adi on 3/27/2016.
 */
@Entity
@Table(name="authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    private String profileImage;

    public Author(String fname, String lname){
        this.firstName = fname;
        this.lastName = lname;
    }

    public Author() {

    }

    public long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}
