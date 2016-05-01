define([
    "underscore",
    "react",
    "dispatcher/AppDispatcher",
    "constants/actiontypes"
], function(_, React, AppDispatcher, Constants) {
    return {
        init: function(params) {

        },
        pull : function(query, page, success) {
            $.ajax({
                url:"/api/authors",
                data: {
                    string: query,
                    page: page
                },
                method: "GET",
                success: function(response) {
                    success(response);
                }
            })
        },
    };
});