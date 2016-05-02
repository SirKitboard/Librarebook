"user strict";
define([
    "stores/store",
    "actions/user",
    "constants/actiontypes",
    'underscore'
], function(StoreBase, Action, Constants, _) {
    Store.prototype = new StoreBase();
    Store.constructor = Store;

    function Store(params) {
        StoreBase.call(this, params);

        this.users = [];
        this.pulling = false;
        this.registerDispatchListener(function(action) {
            var self = this;
            switch (action.actionType) {
                case Constants.ADD_USERS:
                    this.addUsers(action.data);
                    break;
                case Constants.DELETE_USER:
                    this.deleteUser(action.data);
                    break;
            }
        }.bind(this));

        this.action = Action;
    }

    Store.prototype.getUsers = function () {
        if (this.users.length === 0) {
            if(this.pulling == false) {
                this.pulling = true;
                this.action.getAll();
            }
        }
        // if (this.users.length > 0) {
        //     if(this.pulling == false) {
        //         this.pulling = true;
        //         var maxId = _.max(this.users, function(user) {
        //             return user.id;
        //         })
        //         this.action.getNew(maxId);
        //     }
        // }
        return this.users;
    };

    Store.prototype.addUsers = function (newUsers) {
        for (var i=0; i<newUsers.length; i++) {
            this.users.push(newUsers[i]);
        }
        this.pulling = false;
        console.log(this.users);
        this.event.emit("change");
    };

    Store.prototype.getUser= function(id) {
        for (var i=0; i<this.users.length; i++) {
            if (this.users[i].id == id) {
                return this.users[i];
            }
        }
    };

    Store.prototype.updateUser = function(updatedUser) {
        for (var i=0; i<this.users.length; i++) {
            if (this.users[i].id == updatedUser.id) {
                this.users[i] = updatedUser;
            }
        }
    };

    Store.prototype.deleteUser = function (id) {
        var newUsers = [];
        for (var i=0; i<this.users.length; i++) {
            if (this.users[i].id != id) {
                newUsers.push(this.users[i]);
            }
        }
        console.log(newUsers);
        this.users = newUsers;
        this.event.emit("change");
    };

    return Store;
});