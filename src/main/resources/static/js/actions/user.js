define([
    "underscore",
    "react",
    "dateformat",
    "dispatcher/AppDispatcher"
], function(_, React, DateFormat, AppDispatcher, Constants) {
    return {
        init: function(params) {

        },
        login: function(refs, error) {
            var email = $(refs.emailLogin).val();
            var password = $(refs.passwordLogin).val();
            // debugger;
            $.ajax({
                url:"/api/login",
                method: "POST",
                data: {
                    email: email,
                    password: password
                },
                success: function(response) {
                    window.location.reload();
                },
                error: function (xhr, status, response) {
                    console.log('fail');
                    if(typeof error == "function") {
                        error();
                    }

                }
            })
        },
        logout: function() {
            $.ajax({
                url:"/api/logout",
                method: "POST",
                success: function() {
                    window.location.reload();
                }
            })
        },
        signup: function(refs, toaster) {
            var dob = new Date($(refs.dob).val());
            dob = dateFormat(dob, "yy/mm/dd");
            $.ajax({
                url: 'api/users',
                method: 'POST',
                data: {
                    firstName: $(refs.first_name).val(),
                    lastName: $(refs.last_name).val(),
                    dob: dob,
                    email: $(refs.email).val(),
                    gender: $(refs.gender).val(),
                    password: $(refs.password).val(),
                    addressLine1: $(refs.address).val(),
                    city: $(refs.city).val(),
                    zipcode: $(refs.zipCode).val(),
                    state: $(refs.state).val(),
                    country: $(refs.country).val(),
                    phone: $(refs.phone).val(),
                },
                success: function() {
                    toaster("Sign up successful");
                },
                error: function(xhr, status, errorThrown) {
                    if(JSON.parse(xhr.responseText).id) {
                        window.alert('Account with this email already exists');
                    }
                }
            });
        }
    };
});