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
                url:"/api/authors",
                method: "GET",
                success: function(response) {
                    _.each(response, function (author) {
                        AppDispatcher.dispatch({
                            actionType: Constants.ADD_AUTHOR,
                            data: author
                        })
                    });
                }
            })
        },
    };
});