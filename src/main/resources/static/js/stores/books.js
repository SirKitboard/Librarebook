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
                case Constants.CHECKOUT:
                    this.checkoutBook(action.data);
                    this.event.emit("change");
            }

        }.bind(this));

        this.action = Action;
    }

    Store.prototype.addBook = function(book) {
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

    Store.prototype.checkout = function(id) {
        this.books[id].checkedOut = true;
    }

    return Store;
})