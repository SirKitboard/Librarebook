"use strict";
define([
    "stores/store",
    "actions/genres",
    "constants/actiontypes"
], function(StoreBase, Action, Constants) {
    Store.prototype = new StoreBase();
    Store.constructor = Store;

    function Store(params) {
        StoreBase.call(this, params);

        this.genres = [];

        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                case Constants.ADD_GENRE:
                    this.addGenre(action.data);
                    break;
            }
        }.bind(this));

        this.action = Action;
    }

    Store.prototype.addGenre = function(genre) {
        this.genres.push(genre)
    };

    Store.prototype.getAll = function() {
        return this.genres;
    };

    return Store;
})