package com.notdecaf.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by Adi on 3/27/2016.
 */
@Entity
@Table(name="addresses")
public class Address {
    public Address() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String line1;

    private String line2;

    @NotNull
    private String city;

    @NotNull
    private String state;

    @NotNull
    private int zipcode;

    @NotNull
    private String country;

    public long getId() {
        return id;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getZipcode() {
        return zipcode;
    }

    public void setZipcode(int zipcode) {
        this.zipcode = zipcode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Address(String line1, String city, String state, int zipcode, String country) {
        this.line1 = line1;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.country = country;
    }


}
