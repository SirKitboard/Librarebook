"use strict";
define([
    "events",
    "dispatcher/AppDispatcher",
    "constants/actiontypes"
], function(EventEmitter, AppDispatcher, Constants) {
    function Store(params)
    {
        params = params || {};
        this.event = new EventEmitter();

        if (params.dispatchListeners) {
            if (Array.isArray(params.dispatchListeners)) {
                for (var fn in params.dispatchListeners) {
                    this.registerDispatchListener(fn);
                }
            } else {
                this.registerDispatchListener(this.params.dispatchListeners);
            }
        }
    };

    Store.prototype.registerDispatchListener = function(callback)
    {
        if (typeof callback === "function") {
            AppDispatcher.register(callback);
        }
    }

    Store.prototype.addChangeListener = function(callback)
    {
        this.event.on("change", callback);
    };

    Store.prototype.removeChangeListener = function(callback)
    {
        this.event.removeListener("change", callback);
    };

    return Store;
});