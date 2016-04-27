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

    Store.prototype.checkoutBook = function(id) {
        if (this.books[id]) {
            this.books[id].checkedOut = true;
        }
    };

    Store.prototype.return = function(id) {
        if (this.books[id]) {
            this.books[id].checkedOut = false;
        }
    };
    
    Store.prototype.renew = function(data) {
        if (this.books[data.bookId]) {
            var book = this.books[data.bookId];
            for (var i=0; i<book.checkedOutBy.length; i++) {
                if (book.checkedOutBy[i].user == data.userId) {
                    book.checkedOutBy[0].dueDate = data.newDate;
                }
            }
        }
    };

    Store.prototype.toggleFavorite = function(response) {
        this.books[response.bookID].favorited = response.status;
    };

    Store.prototype.update = function(book) {
        this.books[book.id] = book;
    };

    return Store;
})