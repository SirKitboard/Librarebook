package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.notdecaf.helpers.PasswordStorage;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.Set;

@Entity
@Inheritance
@DiscriminatorColumn(name = "user_type")
@DiscriminatorValue("user")
@Table(name = "users")

public class User extends IDModel implements Cloneable{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private byte[] hashedPassword;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private Date dob;

    @NotNull
    private String email;

    @OneToOne
    @JoinColumn(name = "address")
    private Address address;

    private String phoneNumber;

    @NotNull
    private String gender;

    private String profileImage;

    private String coverImage;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "users_favorites", joinColumns = {@JoinColumn(name = "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(name = "bookID", referencedColumnName = "id")})
    private Set<Item> favorites;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_shoppingcartitem", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> shoppingCart;

    @JsonBackReference
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_wishlist", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> wishlist;

    @JsonBackReference
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_notinterested", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> notInterested;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<UserCheckedOutItem> currentlyCheckedOutItems;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<UserCheckoutHistory> checkoutHistory;

    @OneToMany
    private Set<UserItemRating> ratings;

    @JsonBackReference
    @OneToMany(mappedBy = "user")
    private Set<UserReviewRating> reviewRatings;

    @OneToOne(cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private UserPreferences preferences;

    @ManyToMany(mappedBy = "flaggedBy")
    private Set<Item> flags;

    public Set<UserCheckedOutItem> getCurrentlyCheckedOutItems() {
        return currentlyCheckedOutItems;
    }

    public void setCurrentlyCheckedOutItems(Set<UserCheckedOutItem> currentlyCheckedOutItems) {
        this.currentlyCheckedOutItems = currentlyCheckedOutItems;
    }

    public Set<UserCheckoutHistory> getCheckoutHistory() {
        return checkoutHistory;
    }

    public void setCheckoutHistory(Set<UserCheckoutHistory> checkoutHistory) {
        this.checkoutHistory = checkoutHistory;
    }

    public Set<Item> getFlags() {
        return flags;
    }

    public void setFlags(Set<Item> flags) {
        this.flags = flags;
    }



    public User(String firstName, String lastName, Date dob, String email, String gender, String password, Address address) throws PasswordStorage.CannotPerformOperationException {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.hashedPassword = PasswordStorage.createHash(password).getBytes();
        this.address = address;
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

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public UserPreferences getPreferences() {
        return preferences;
    }

    public void setPreferences(UserPreferences preferences) {
        this.preferences = preferences;
    }

    public void setPassword(String password) {
        try {
            this.hashedPassword = PasswordStorage.createHash(password).getBytes();
        } catch (PasswordStorage.CannotPerformOperationException e) {

        }
    }

    public Set<Item> getFavorites() {
        return favorites;
    }

    public void setFavorites(Set<Item> favorites) {
        this.favorites = favorites;
    }

    public void addToFavorites(Item item) {
        favorites.add(item);
    }

    public Set<Item> getShoppingCart() {
        return shoppingCart;
    }

    public void setShoppingCart(Set<Item> shoppingCart) {
        this.shoppingCart = shoppingCart;
    }

    public Set<Item> getWishlist() {
        return wishlist;
    }

    public void setWishlist(Set<Item> wishlist) {
        this.wishlist = wishlist;
    }

    public Set<Item> getNotInterested() {
        return notInterested;
    }

    public void setNotInterested(Set<Item> notInterested) {
        this.notInterested = notInterested;
    }

    public Set<UserItemRating> getRatings() {
        return ratings;
    }

    public void setRatings(Set<UserItemRating> ratings) {
        this.ratings = ratings;
    }

    public Set<UserReviewRating> getReviewRatings() {
        return reviewRatings;
    }

    public void setReviewRatings(Set<UserReviewRating> reviewRatings) {
        this.reviewRatings = reviewRatings;
    }

    public void addToCart(Item item){shoppingCart.add(item);}

    public void handleUpdate(HashMap<String, String> params) {
        //TODO: Handle update
    }

    public boolean equals(User user) {
        if(user.getId() == this.getId()) {
            return true;
        }
        return false;
    }

    @Override
    public boolean equals(Object object) {
        try {
            User user = (User) object;
            if(user.getId() == this.getId()) {
                return true;
            }
        } catch(Exception e) {
            // Do nothing
        }
        return false;
    }
}