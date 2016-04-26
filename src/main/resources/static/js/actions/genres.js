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
                url:"/api/genres",
                method: "GET",
                success: function(response) {
                    _.each(response, function (genre) {
                        AppDispatcher.dispatch({
                            actionType: Constants.ADD_GENRE,
                            data: genre
                        })
                    });
                }
            })
        },
    };
});