package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;
import com.notdecaf.helpers.PDF;
import com.notdecaf.helpers.SetHelper;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.xml.crypto.dsig.spec.ExcC14NParameterSpec;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="item_type")
@Table(name = "items")
@Cacheable(false)
public abstract class Item extends IDModel{
    public Item() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String title;

    public int getMaturity() {
        return maturity;
    }

    public void setMaturity(int maturity) {
        this.maturity = maturity;
    }

    @NotNull
    private int maturity;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinTable(name="items_genres", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Genre> genres;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinTable(name="items_authors", joinColumns={@JoinColumn(referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(referencedColumnName = "id")})
    private Set<Author> authors;

    @JsonIgnore
    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoritedBy;

    @ManyToOne
    private Publisher publisher;

    private String isbn;

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name="items_flags", joinColumns = {@JoinColumn(name="itemID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(name = "userID", referencedColumnName = "id")})
    private Set<User> flaggedBy;

    @Column(columnDefinition = "TEXT")
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

    private String samplePath;

    public String getSamplePath() {
        return PDF.getSamplePDFPath(this.samplePath);
    }

    public void setSamplePath(String samplePath) {
        this.samplePath = samplePath;
    }
    
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "item")
    private Set<UserItemRating> ratings;

    @ManyToOne
    @JoinColumn(name = "series")
    private Series series;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "item")
    private Set<UserCheckedOutItem> checkedOutBy;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "item")
    private Set<UserCheckoutHistory> checkoutHistory;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "item")
    private Set<HoldItem> holdsBy;

    public Set<UserCheckedOutItem> getCheckedOutBy() {
        return checkedOutBy;
    }

    public void setCheckedOutBy(Set<UserCheckedOutItem> checkedOutBy) {
        this.checkedOutBy = checkedOutBy;
    }

    public void addCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.checkedOutBy.add(checkedOutItem);
    }

    public void removeCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.checkedOutBy = SetHelper.remove(this.checkedOutBy,checkedOutItem);
    }

    public void updateCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.checkedOutBy = SetHelper.update(this.checkedOutBy,checkedOutItem);
    }

    public Set<UserCheckoutHistory> getCheckoutHistory() {
        return checkoutHistory;
    }

    public void setCheckoutHistory(Set<UserCheckoutHistory> checkoutHistory) {
        this.checkoutHistory = checkoutHistory;
    }

    public int getNumSales() {
        return this.checkoutHistory.size() + this.checkedOutBy.size();
    }

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
        try {
            return this.totalLicenses - checkedOutBy.size();
        } catch (Exception e) {
            return this.totalLicenses;
        }
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

    public double getRating() {
        double value = 0;
        for(UserItemRating rating: this.ratings) {
            value+= rating.getRating();
        }
        return value/(this.ratings.size() == 0 ? 1 : this.ratings.size());
    }

    public void setRatings(Set<UserItemRating> ratings) {
        this.ratings = ratings;
    }

    public void addRating(UserItemRating rating) {
        this.ratings.add(rating);
    }

    public void removeRating(UserItemRating rating) {
        this.ratings = SetHelper.remove(this.ratings, rating);
    }

    public void updateRating(UserItemRating rating) {
        this.ratings = SetHelper.update(this.ratings, rating);
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Set<HoldItem> getHoldsBy() {
        return holdsBy;
    }

    public void setHoldsBy(Set<HoldItem> holdsBy) {
        this.holdsBy = holdsBy;
    }

    public void addHold(HoldItem holdItem) {
        this.holdsBy.add(holdItem);
    }

    public void removeHold(HoldItem holdItem) {
        this.holdsBy = SetHelper.remove(this.holdsBy,holdItem);
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
        this.ratings = new HashSet<>();
        this.checkedOutBy = new HashSet<>();
        this.checkoutHistory = new HashSet<>();
        this.favoritedBy = new HashSet<>();
    }

}
