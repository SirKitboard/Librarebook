package com.notdecaf.models;

import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Set;

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

    public Book(String title, Set<Genre> genres, Set<Author> authors, Publisher publisher, String description, int yearPublished, int totalLicenses, Language language, ItemStatus status, int numPages) {
        super(title, genres, authors, publisher, description, yearPublished, totalLicenses, language, status);
        this.numPages = numPages;
    }

    public int getNumPages() {
        return numPages;
    }

    public void setNumPages(int numPages) {
        this.numPages = numPages;
    }
}
