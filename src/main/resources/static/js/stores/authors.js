"use strict";
define([
    "stores/store",
    "actions/authors",
    "constants/actiontypes"
], function(StoreBase, Action, Constants) {
    Store.prototype = new StoreBase();
    Store.constructor = Store;

    function Store(params) {
        StoreBase.call(this, params);

        this.authors = [];

        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                case Constants.ADD_AUTHOR:
                    this.addAuthor(action.data);
                    this.event.emit("change");
                    break;
            }
        }.bind(this));

        this.action = Action;
    }

    Store.prototype.addAuthor = function(author) {
        this.authors.push(author)
    };

    Store.prototype.getAll = function() {
        return this.authors;
    };

    return Store;
})