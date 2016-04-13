define([
    "underscore",
    "react",
    "dispatcher/AppDispatcher",
    "constants/actiontypes"
], function(_, React, AppDispatcher, Constants) {
    return {
        init: function(params) {

        },
        pullRecents : function() {
            $.ajax({
                url:"/api/items/books/recent",
                method: "GET",
                success: function(response) {
                    _.each(response, function (book) {
                        AppDispatcher.dispatch({
                            actionType: Constants.ADD_RECENT_BOOK,
                            data: book
                        })
                    });
                }
            })
        },
        
        checkout: function(id) {
            $.ajax({
                url: "/api/items/"+id+"/checkout",
                method: "POST",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.CHECKOUT,
                        data: id
                    })
                }
            })
        },
        
        getBook: function(id) {
            $.ajax({
                url: "/api/items/books/"+id,
                method: "GET",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.ADD_BOOK,
                        data:response
                    })
                }
            })
        },

        toggleFavorite: function(book) {
            $.ajax({
                url: "/api/items/"+book.id+"/favorite",
                method: "POST",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.FAVORITE,
                        data: {
                            status: response.favorited,
                            bookID: book.id
                        }
                    })
                }
            })
        }
    };
});