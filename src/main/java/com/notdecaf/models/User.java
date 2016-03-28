package com.notdecaf.models;

import com.notdecaf.helpers.PasswordStorage;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Inheritance
@DiscriminatorColumn(name = "user_type")
@DiscriminatorValue("user")
@Table(name="users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private byte [] hashedPassword;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private Date dob;

    @NotNull
    private String email;

    @OneToOne
    @JoinColumn(name="address")
    private Address address;

    private String phoneNumber;

    @NotNull
    private String gender;

    private String profileImage;

    private String coverImage;

    public User(String firstName, String lastName, Date dob, String email, String gender, String password) throws PasswordStorage.CannotPerformOperationException {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.hashedPassword = PasswordStorage.createHash(password).getBytes();
    }

    public User() {

    }

    public boolean verifyCredentials(String password) {
        try {
            return PasswordStorage.verifyPassword(password, new String(hashedPassword));
        } catch (PasswordStorage.CannotPerformOperationException e) {

        } catch (PasswordStorage.InvalidHashException e) {
            e.printStackTrace();
        }
        return false;
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

    public Date getDob() {
        return dob;
    }

    public String getEmail() {
        return email;
    }

    public Address getAddress() {
        return address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setPassword(String password){
        try {
            this.hashedPassword = PasswordStorage.createHash(password).getBytes();
        } catch (PasswordStorage.CannotPerformOperationException e) {

        }
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public void phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

     public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }
}