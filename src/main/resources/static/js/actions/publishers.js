define([
    "underscore",
    "react",
    "dispatcher/AppDispatcher",
    "constants/actiontypes"
], function(_, React, AppDispatcher, Constants) {
    return {
        init: function(params) {

        },
        pull : function() {
            $.ajax({
                url:"/api/publishers",
                method: "GET",
                success: function(response) {
                    _.each(response, function (publisher) {
                        AppDispatcher.dispatch({
                            actionType: Constants.ADD_PUBLISHER,
                            data: publisher
                        })
                    });
                }
            })
        },
    };
});