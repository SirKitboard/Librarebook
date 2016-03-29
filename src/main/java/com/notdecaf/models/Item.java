package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="item_type")
@Table(name = "items")
public abstract class Item {
    public Item() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String title;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_genres", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Genre> genres;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_authors", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Author> authors;

    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoritedBy;

    @ManyToOne
    private Publisher publisher;

    private String description;

    @NotNull
    private int yearPublished;

    @NotNull
    private int totalLicenses;

    @Enumerated(EnumType.STRING)
    private Language language;

    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    private String coverImageUrl;

    @JsonBackReference
    @OneToMany
    private Set<UserItemRating> ratings;

    @JsonBackReference
    @ManyToOne
    private Series series;

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getYearPublished() {
        return yearPublished;
    }

    public void setYearPublished(int yearPublished) {
        this.yearPublished = yearPublished;
    }

    public int getTotalLicenses() {
        return totalLicenses;
    }

    public void setTotalLicenses(int totalLicenses) {
        this.totalLicenses = totalLicenses;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public int getAvailableLicenses() {
        // Calculate total licenses based on user checkout mapping
        return this.totalLicenses;
    }

    public Set<UserItemRating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<UserItemRating> ratings) {
        this.ratings = ratings;
    }

    public Series getSeries() {
        return series;
    }

    public void setSeries(Series series) {
        this.series = series;
    }

    public Item(String title, Set<Genre> genres, Set<Author> authors, Publisher publisher, String description, int yearPublished, int totalLicenses, Language language, ItemStatus status) {
        this.title = title;
        this.genres = genres;
        this.authors = authors;
        this.publisher = publisher;
        this.description = description;
        this.yearPublished = yearPublished;
        this.totalLicenses = totalLicenses;
        this.language = language;
        this.status = status;
    }

}
