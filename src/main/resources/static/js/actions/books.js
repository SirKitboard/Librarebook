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
                        data: {
                            checkOutItem: response,
                            id: id
                        }
                    })
                }
            })
        },

        return: function(id) {
          $.ajax({
              url: "/api/items/"+id+"/return",
              method: "POST",
              success: function(reponse) {
                  AppDispatcher.dispatch({
                      actionType: Constants.RETURN,
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

        addBook: function(data) {
            $.ajax({
                url: "/api/items/books",
                method: "POST",
                data: data,
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.ADD_BOOK,
                        data: response
                    })
                }
            })
        },
        editBook: function(data, id, success) {
            $.ajax({
                url: "/api/items/books/"+id,
                method: "PUT",
                data: data,
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.ADD_BOOK,
                        data: response
                    })
                    success(response);
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
        },
        purchase : function(bookID, isbn) {

            $.ajax({
                url:"/api/items/"+bookID+"/purchase",
                method: "POST",
                success: function(response) {
                    // console.log(response);
                    response = response.replace(/"/g,"");
                    window.open("http://localhost:6544/gotoBook?accessToken="+response+"&isbn="+isbn);
                }
            })
        },
        renew: function(id) {
            $.ajax({
                url:"/api/items/"+id+"/renew",
                method: "POST",
                success: function (response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.RENEW,
                        data: {
                            bookId: id,
                            newDate: response
                        }
                    })
                }
            });
        },
        toggleRenew: function(id) {
          $.ajax({
              url:"/api/items/"+id+"/autorenew",
              method: "POST",
              success: function (response) {
                  AppDispatcher.dispatch({
                      actionType: Constants.TOGGLE_RENEW,
                      data: {
                          bookId: id,
                          willRenew: response
                      }
                  })
              }
          });
        },
        update : function(refs, bookID) {
            $.ajax({
                url: "/api/items/books/" + bookID,
                method: "PUT",
                data: {
                    title: $(refs.title).val(),
                    description: $(refs.description).val(),
                    yearPublished: $(refs.yearPublished).val(),
                    totalLicenses: $(refs.totalLicenses).val(),
                    language: $(refs.language).val(),
                    status: $(refs.status).val(),
                    numPages: $(refs.numPages).val(),
                },
                success: function (response) {
    
                }
            })
        },
        delete : function(bookID) {
            $.ajax({
                url: "/api/items/books/" + bookID,
                method: "DELETE",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.DELETE_BOOK,
                        data: {
                            data: response
                        }
                    })
                }
            })
        },
        search: function(params, success, noMoreContent) {
            $.ajax({
                method:"GET",
                url:"/api/items/books",
                data: params,
                success: function(response, status, jqxhr) {
                    if(jqxhr.status == 200) {
                        console.log(response.length);
                        _.each(response, function (book) {
                            AppDispatcher.dispatch({
                                actionType: Constants.ADD_BOOK,
                                data: book
                            })
                        });
                        success(response);
                    }
                    else {
                        success([]);
                        noMoreContent()
                    }
                }
            })
        },
        sendEmail : function(refs, bookID) {
            var toEmail = refs.emailInput.value;
            $.ajax({
                url: "/api/items/books/"+bookID+"/share",
                method: "POST",
                data: {
                    toEmail: toEmail
                },
                success: function(response) {
                    console.log(response)
                },
                error: function (result, status, err) {
                    console.log("error", result);
                }
            })
        },
        addHold: function(id) {
            $.ajax({
               url: "/api/items/"+id+"/hold",
                method: "POST",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.HOLD,
                        data: {
                            bookId: id,
                            holdItem: response
                        }
                    })
                }
            });
        },
        removeHold: function(id) {
            $.ajax({
                url: "/api/items/"+id+"/removehold",
                method: "POST",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.REMOVE_HOLD,
                        data: id
                    })
                }
            })
        },
        toggleWishlist: function(id, success, error) {
            $.ajax({
                url: "/api/items/" + id + "/wishlist",
                method: "POST",
                success: function(response){
                    if (typeof success == "function") {
                        success("Success");
                    }
                },
                error: function(result, status, err) {
                    if (typeof error == "function") {
                        error("Failed");
                    }
                }
            })
        },
        rate: function (id, rating) {
            $.ajax({
                url: "/api/items/"+id+"/rate",
                method: "POST",
                data: {
                    rating: rating
                },
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.RATE,
                        data: {
                            bookId: id,
                            ratingItem: response
                        }
                    })
                }
            })
        },
        deleteRating: function(id) {
            $.ajax({
                url: "/api/items/"+id+"/removerating",
                method: "DELETE",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.REMOVE_RATING,
                        data: id
                    })
                }
            })
        },
        recommendExistingBook: function(id) {
            $.ajax({
                url: "/api/items/books/"+id+"/recommend",
                method: "POST",
                success: function () {
                    window.currentUser.recommendedBooks.push({
                        item: id,
                        user: window.currentUser.id,
                        status: 0
                    });
                    Materialize.toast("Book recommended", 4000);
                }
            })
        },
        recommendNewBook: function(data) {
            $.ajax({
                url: "/api/items/books/recommended",
                method: "POST",
                data: data,
                success: function () {
                    window.currentUser.recommendedBooks.push({
                        item: id,
                        user: window.currentUser.id,
                        status: 0
                    });
                    Materialize.toast("Book recommended", 4000);
                }
            })
        },
        getRecommended: function(id) {
            $.ajax({
                url: "/api/items/books/"+id+"/recommended",
                method: "GET",
                success: function(response) {
                    AppDispatcher.dispatch({
                        actionType: Constants.RECOMMEND,
                        data: {
                            bookId: id,
                            recommendations: response
                        }
                    })
                }
            });
        },
        getUserRecommended: function() {
            $.ajax({
                url: "/api/items/books/recommended",
                method: "GET",
                success: function(res) {
                    _.each(res, function(item) {
                        AppDispatcher.dispatch({
                            actionType: Constants.ADD_USER_RECOMMENDED,
                            data: item
                        })
                    })
                }
            })
        },
        approveRecommendation: function(id) {
            $.ajax({
                url: "/api/items/books/recommended/"+id+"/approve",
                method: "PUT",
                success: function(res) {
                    AppDispatcher.dispatch({
                        actionType: Constants.REMOVE_USER_RECOMMENDATION,
                        data: res
                    })
                }
            })
        },
        rejectRecommendation: function(id) {
            $.ajax({
                url: "/api/items/books/recommended/"+id+"/reject",
                method: "PUT",
                success: function(res) {
                    AppDispatcher.dispatch({
                        actionType: Constants.REMOVE_USER_RECOMMENDATION,
                        data: res
                    })
                }
            })
        }
    };
});