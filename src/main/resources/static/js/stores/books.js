"use strict";
define([
    "stores/store",
    "actions/books",
    "constants/actiontypes"
], function(StoreBase, Action, Constants) {
    Store.prototype = new StoreBase();
    Store.constructor = Store;

    function Store(params) {
        StoreBase.call(this, params);
        
        this.books = {};
        this.recents = {};
        this.recommended = {};
        this.userRecommendedExisting = {};
        this.userRecommendedNew = {};
        this.currentlyPulling = {};

        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                case Constants.ADD_BOOK:
                    this.addBook(action.data);
                    this.event.emit("change");
                    break;
                case Constants.ADD_RECENT_BOOK:
                    this.addRecentBook(action.data);
                    this.event.emit("change");
                    break;
                case Constants.CHECKOUT:
                    this.checkoutBook(action.data);
                    this.event.emit("change");
                    break;
                case Constants.FAVORITE:
                    this.toggleFavorite(action.data);
                    this.event.emit("change");
                    break;
                case Constants.RETURN:
                    this.return(action.data);
                    this.event.emit("change");
                    break;
                case Constants.UPDATE_BOOK:
                    this.update(action.data);
                    this.event.emit("change");
                    break;
                case Constants.RENEW:
                    this.renew(action.data);
                    this.event.emit("change");
                    break;
                case Constants.TOGGLE_RENEW:
                    this.toggleAutoRenew(action.data);
                    this.event.emit("change");
                    break;
                case Constants.HOLD:
                    this.hold(action.data);
                    this.event.emit("change");
                    break;
                case Constants.REMOVE_HOLD:
                    this.removeHold(action.data);
                    this.event.emit("change");
                    break;
                case Constants.RATE:
                    this.rate(action.data);
                    this.event.emit("change");
                    break;
                case Constants.REMOVE_RATING:
                    this.removeRating(action.data);
                    this.event.emit("change");
                    break;
                case Constants.RECOMMEND:
                    this.addRecommended(action.data);
                    this.event.emit("change");
                    break;
                case Constants.ADD_USER_RECOMMENDED:
                    this.addUserRecommended(action.data);
                    this.event.emit("change");
                    break;
                case Constants.REMOVE_USER_RECOMMENDATION:
                    this.removeUserRecommended(action.data);
                    this.event.emit("change");
                    break;
            }

        }.bind(this));

        this.action = Action;
    }

    Store.prototype.addBook = function(book) {
        if (window.currentUser) {
            if (window.currentUser.favoriteItemIDs.indexOf(book.id) >= 0) {
                book.favorited = true;
            }
        }
        this.books[book.id] = book;
    };

    Store.prototype.addRecentBook = function(book) {
        this.books[book.id] = book;
        this.recents[book.id] = book;
    };

    Store.prototype.getRecents = function() {
        // debugger;
        return this.recents;
    };

    Store.prototype.getBookOrPull = function(id) {
        if (this.books[id]) {
            return this.books[id];
        } else {
            if(!this.currentlyPulling[id]) {
                this.currentlyPulling[id] = true;
                this.action.getBook(id);
            }
            return null;
        }
    };

    Store.prototype.getBook = function (id) {
        return this.books[id];
    };

    Store.prototype.checkoutBook = function(data) {
        if (this.books[data.id]) {
            this.books[data.id].checkedOut = true;
            this.books[data.id].checkedOutBy.push(data.checkOutItem);
            window.currentUser.currentlyCheckedOutItems.push(data.checkedOutItem);
            this.books[data.id].availableLicenses--;
        }
    };

    Store.prototype.return = function(id) {
        if (this.books[id]) {
            this.books[id].checkedOut = false;
            this.books[id].checkedOutBy = this.books[id].checkedOutBy.filter(function (item) {
               return item.user == window.currentUser.id;
            });
            window.currentUser.currentlyCheckedOutItems = window.currentUser.currentlyCheckedOutItems.filter(function(checkout) {
               return checkout.item = id;
            });
            this.books[id].availableLicenses++;
        }
    };
    
    Store.prototype.renew = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            var user = window.currentUser;
            var userId = window.currentUser.id;
            for (var i=0; i<book.checkedOutBy.length; i++) {
                if (book.checkedOutBy[i].user == userId) {
                    book.checkedOutBy[i].dueDate = data.newDate;
                }
            }
            for (var i=0; i<user.currentlyCheckedOutItems.length; i++) {
                if (user.currentlyCheckedOutItems[i].item == data.bookId) {
                    user.currentlyCheckedOutItems[i].dueDate = data.newDate;
                }
            }
        }
    };
    
    Store.prototype.toggleAutoRenew = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            var user = window.currentUser;
            for (var i=0; i<book.checkedOutBy.length; i++) {
                if (book.checkedOutBy[i].user == user.id) {
                    book.checkedOutBy[i].willRenew = data.willRenew;
                }
            }
            for (var i=0; i<user.currentlyCheckedOutItems.length; i++) {
                if (user.currentlyCheckedOutItems.item == data.bookId) {
                    user.currentlyCheckedOutItems[i].willRenew = data.willRenew;
                }
            }
        }
    };

    Store.prototype.toggleFavorite = function(response) {
        this.books[response.bookID].favorited = response.status;
    };

    Store.prototype.hold = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            book.holdsBy.push(data.holdItem);
            window.currentUser.holdItems.push(data.holdItem);
        }
    };

    Store.prototype.removeHold = function(id) {
        if (this.books[id]) {
            var book = this.books[id];
            window.currentUser.holdItems = window.currentUser.holdItems.filter(function (hold) {
               return hold.item !== id;
            });
            this.books[id].holdsBy = this.books[id].holdsBy.filter(function (hold) {
                return hold.user !== window.currentUser.id;
            });
        }
    };

    Store.prototype.getCheckedOutbooks = function() {
        var books = [];
        var self = this;
        _.each(window.currentUser.currentlyCheckedOutItems, function(item) {
            if(self.books[item.item]) {
                books.push(self.books[item.item])
            } else {
                self.action.getBook(item.item);
            }
        });
        return books;
    }

    Store.prototype.getHeldBooks = function() {
        var books = [];
        var self = this;
        _.each(window.currentUser.holdItems, function(item) {
            if(self.books[item.item]) {
                books.push(self.books[item.item])
            } else {
                self.action.getBook(item.item);
            }
        });
        return books;
    }

    Store.prototype.getRatedBooks = function(){
        var books = [];
        var self = this;
        _.each(window.currentUser.ratings, function(item){
            if(self.books[item.item]) {
                books.push(self.books[item.item])
            } else {
                self.action.getBook(item.item);
            }

        });
        return books;
    }
    Store.prototype.rate = function(data) {
        if (this.books[data.bookId]) {
            var exists = false;
            for (var i=0; i<this.book.ratings.length; i++) {
                if (book.ratings[i].user === window.currentUser.id) {
                    this.book.ratings[i] = data.ratingItem;
                    window.currentUser.ratings[i] = data.ratingItem;
                    exists = true;
                }
            }
            if (!exists) {
                this.books[data.bookId].ratings.push(data.ratingItem);
                window.currentUser.ratings.push(data.ratingItem);
            }
        }
    };

    Store.prototype.removeRating = function(id) {
        if (this.books[id]) {
            this.books[id].ratings = this.books[id].ratings.filter(function (rating) {
                return rating.user !== window.currentUser.id;
            });
            window.currentUser.ratings = window.currentUser.ratings.filter(function (rating) {
               return rating.item !== id;
            });
        }
    };

    Store.prototype.getRecommendedOrPull = function(id) {
        if (this.recommended[id]) {
            return this.recommended[id];
        } else {
            this.action.getRecommended(id);
            return null;
        }
    };
    
    Store.prototype.addRecommended = function(data) {
        this.recommended[data.bookId] = data.recommendations;
    };
    
    Store.prototype.getRecommended = function(id) {
        return this.recommended[id];
    };

    Store.prototype.addUserRecommended = function(book) {
        if(book.item == 0) {
            this.userRecommendedNew[book.id] = book;
        } else {
            this.userRecommendedExisting[book.id] = book;
        }
    };

    Store.prototype.removeUserRecommended = function(book) {
        if(this.userRecommendedNew[book.id]) {
            delete this.userRecommendedNew[book.id];
        }
        if(this.userRecommendedExisting[book.id]){
            delete this.userRecommendedExisting[book.id];
        }
    };

    Store.prototype.getUserRecommended = function() {
        return {
            existing: this.userRecommendedExisting,
            newBooks: this.userRecommendedNew
        }
    }

    return Store;
})