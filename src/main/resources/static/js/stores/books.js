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

        this.books = [];

        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                
            }
        }.bind(this));

        this.action = Action;
    }

    return Store;
})