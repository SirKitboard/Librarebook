package com.notdecaf.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.helpers.SetHelper;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
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

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "users_favorites", joinColumns = {@JoinColumn(name = "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn(name = "bookID", referencedColumnName = "id")})
    private Set<Item> favorites;

//    @JsonBackReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_shoppingcartitem", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> shoppingCart;

//    @JsonBackReference
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_wishlist", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> wishlist;

//    @JsonBackReference
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "user_notinterested", joinColumns = {@JoinColumn(name= "userID", referencedColumnName = "id")}, inverseJoinColumns = {@JoinColumn (name ="itemID", referencedColumnName = "id")})
    private Set <Item> notInterested;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<UserCheckedOutItem> currentlyCheckedOutItems;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<UserRecommendedBook> recommendedBooks;


    public Set<UserRecommendedBook> getRecommendedBooks() {
        return recommendedBooks;
    }

    public void setRecommendedBooks(Set<UserRecommendedBook> recommendedBooks) {
        this.recommendedBooks = recommendedBooks;
    }

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private Set<UserCheckoutHistory> checkoutHistory;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
    private Set<UserItemRating> ratings;

    @JsonBackReference
    @OneToMany(mappedBy = "user")
    private Set<UserReviewRating> reviewRatings;

    @OneToOne(cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private UserPreferences preferences;

    @ManyToMany(mappedBy = "flaggedBy")
    private Set<Item> flags;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
    private Set<HoldItem> holdItems;

    @NotNull
    private String role = "user";

    public User(String firstName, String lastName, Date dob, String email, String gender, String password, Address address, String phoneNumber) throws PasswordStorage.CannotPerformOperationException {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.hashedPassword = PasswordStorage.createHash(password).getBytes();
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.profileImage = "";
        this.coverImage = "";
        this.favorites = new HashSet<Item>();
        this.shoppingCart = new HashSet<Item>();
        this.wishlist = new HashSet<Item>();
        this.notInterested = new HashSet<Item>();
        this.currentlyCheckedOutItems = new HashSet<UserCheckedOutItem>();
        this.checkoutHistory = new HashSet<UserCheckoutHistory>();
        this.ratings = new HashSet<UserItemRating>();
        this.reviewRatings = new HashSet<UserReviewRating>();
        this.flags = new HashSet<Item>();
        this.holdItems = new HashSet<HoldItem>();
    }

    public User() {

    }

    public Set<UserCheckedOutItem> getCurrentlyCheckedOutItems() {
        return currentlyCheckedOutItems;
    }

    public void setCurrentlyCheckedOutItems(Set<UserCheckedOutItem> currentlyCheckedOutItems) {
        this.currentlyCheckedOutItems = currentlyCheckedOutItems;
    }

    public void addCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.currentlyCheckedOutItems.add(checkedOutItem);
    }

    public void addRecommendedBook(UserRecommendedBook recommendedBook) {
        this.recommendedBooks.add(recommendedBook);
    }

    public void removeCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.currentlyCheckedOutItems = SetHelper.remove(this.currentlyCheckedOutItems,checkedOutItem);
    }

    public void updateCheckedOutItem(UserCheckedOutItem checkedOutItem) {
        this.currentlyCheckedOutItems = SetHelper.update(currentlyCheckedOutItems,checkedOutItem);
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

    public String getUserType() {
        return "user";
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

    public void addToWishList(Item item){
        wishlist.add(item);
        this.setWishlist(wishlist);
    }

    public void removeFromWishList(Item item){
        wishlist.remove(item);
        this.setWishlist(wishlist);
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

    public void addRating(UserItemRating rating) {
        this.ratings.add(rating);
    }

    public void removeRating(UserItemRating rating) {
        this.ratings = SetHelper.remove(this.ratings, rating);
    }

    public void updateRating(UserItemRating rating) {
        this.ratings = SetHelper.update(this.ratings, rating);
    }

    public Set<UserReviewRating> getReviewRatings() {
        return reviewRatings;
    }

    public void setReviewRatings(Set<UserReviewRating> reviewRatings) {
        this.reviewRatings = reviewRatings;
    }

    public void addToCart(Item item){shoppingCart.add(item);}


    public Set<HoldItem> getHoldItems() {
        return holdItems;
    }

    public void setHoldItems(Set<HoldItem> holdItems) {
        this.holdItems = holdItems;
    }

    public void addHold(HoldItem holdItem) {
        this.holdItems.add(holdItem);
    }

    public void removeHold(HoldItem holdItem) {
        this.holdItems = SetHelper.remove(this.holdItems,holdItem);
    }

    public void handleUpdate(HashMap<String, String> params) {
        //TODO: Handle update
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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