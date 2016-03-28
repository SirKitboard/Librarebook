package com.notdecaf.models;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@DiscriminatorValue("book")
@Table(name="books")
public class Book extends Item{
    public Book() {
    }

    private int numPages;

}
