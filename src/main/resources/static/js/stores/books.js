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
            this.action.getBook(id);
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
            this.books[data.id].availableLicenses--;
        }
    };

    Store.prototype.return = function(id) {
        if (this.books[id]) {
            this.books[id].checkedOut = false;
            this.books[id].availableLicenses++;
        }
    };
    
    Store.prototype.renew = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            var userId = window.currentUser.id;
            for (var i=0; i<book.checkedOutBy.length; i++) {
                if (book.checkedOutBy[i].user == userId) {
                    book.checkedOutBy[0].dueDate = data.newDate;
                }
            }
        }
    };
    
    Store.prototype.toggleAutoRenew = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            var userId = window.currentUser.id;
            for (var i=0; i<book.checkedOutBy.length; i++) {
                if (book.checkedOutBy[i].user == userId) {
                    book.checkedOutBy[0].willRenew = data.willRenew;
                }
            }
        }
    };

    Store.prototype.toggleFavorite = function(response) {
        this.books[response.bookID].favorited = response.status;
    };

    Store.prototype.hold = function(id) {
        if (this.books[id]) {
            if (window.currentUser.holdItems) {
                window.currentUser.holdItems.push(this.books[id]);
            } else {
                window.currentUser.holdItems = [this.books.id];
            }
        }
    };

    Store.prototype.removeHold = function(id) {
        if (this.books[id]) {
            window.currentUser.holdItems = window.currentUser.holdItems.filter(function (item) {
               return item.id !== id;
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

    Store.prototype.rate = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            var exists = false;
            for (var i=0; i<book.ratings.length; i++) {
                if (book.ratings[i].user === window.currentUser.id) {
                    book.ratings[i] = data.ratingItem;
                    this.books[data.bookId] = book;
                    exists = true;
                }
            }
            if (!exists) {
                this.books[data.bookId].ratings.push(data.ratingItem);
            }
        }
    };

    Store.prototype.removeRating = function(id) {
        if (this.books[id]) {
            this.books[id].ratings = this.books[id].ratings.filter(function (rating) {
                return rating.user !== window.currentUser.id;
            });
        }
    };

    Store.prototype.update = function(id) {
        this.books[id] = book;
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

    return Store;
})