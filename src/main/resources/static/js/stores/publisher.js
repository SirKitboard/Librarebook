"use strict";
define([
    "stores/store",
    "actions/publishers",
    "constants/actiontypes"
], function(StoreBase, Action, Constants) {
    Store.prototype = new StoreBase();
    Store.constructor = Store;

    function Store(params) {
        StoreBase.call(this, params);

        this.publishers = [];

        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                case Constants.ADD_PUBLISHER:
                    this.addPublisher(action.data);
                    break;
            }
        }.bind(this));

        this.action = Action;
    }

    Store.prototype.addPublisher = function(publisher) {
        this.genres.push(publisher)
    };

    Store.prototype.getAll = function() {
        return this.publishers;
    };

    return Store;
})