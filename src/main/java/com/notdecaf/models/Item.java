package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="item_type")
@Table(name = "items")
public abstract class Item extends IDModel{
    public Item() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String title;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_genres", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Genre> genres;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_authors", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Author> authors;

    @JsonIgnore
    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoritedBy;

    @ManyToOne
    private Publisher publisher;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_flags", joinColumns = {@JoinColumn(name="itemID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(name = "userID", referencedColumnName = "id")})
    private Set<User> flaggedBy;

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

    @CreatedDate
    private Date dateAdded;

    @JsonBackReference
    @OneToMany
    private Set<UserItemRating> ratings;

    @ManyToOne
    @JoinColumn(name = "series")
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

    public Series getSeries() {
        return series;
    }

    public void setSeries(Series series) {
        this.series = series;
    }
    public Set<User> getFavoritedBy() {
        return favoritedBy;
    }

    public void setFavoritedBy(Set<User> favoritedBy) {
        this.favoritedBy = favoritedBy;
    }

    public Set<User> getFlaggedBy() {
        return flaggedBy;
    }

    public void setFlaggedBy(Set<User> flaggedBy) {
        this.flaggedBy = flaggedBy;
    }

    public Set<UserItemRating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<UserItemRating> ratings) {
        this.ratings = ratings;
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
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
