define([
    "underscore",
    "react",
    'jsx!components/template/shoppingcart',
    'react-dom',
    'actions/user',
    'jsx!components/widgets/policy'
], function(_, React, ShoppingCartComponent, ReactDOM, UserActions, PolicyComponent) {
    return React.createClass({
        getInitialState: function(){
            // debugger;
            var loggedIn = false;
            var signupForm = false;
            var agreed = false;
            if(window.currentUser) {
                loggedIn = true;
            }
            var book = {
                title: null,
                description: null,
                author: null
            };
            books = [book, book, book, book];
            return {
                'loggedIn': loggedIn,
                'books': books,
                cartOpen: false,
                showSearchDetails: false,
                signupForm : false,
                agreed : false,
            }
        },
        componentDidMount : function() {
            $(".dropdown-button").dropdown();
            $(".button-collapse").sideNav();
            var shoppingCart = <ShoppingCartComponent onClose={this.toggleCart} books={this.state.books}/>
            if(this.state.loggedIn) {
                ReactDOM.render(shoppingCart, document.getElementById('cart'))
            }
            $(".modal-trigger.login-modal").leanModal();
            $(document).ready(function(){
                $('ul.tabs.login').tabs();
            });
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 60 // Creates a dropdown of 15 years to control year
            });
            var self = this;
            $("#searchDetails").mouseleave(function() {
                if($(".nav-search").find(":focus").length > 0 ){
                    return;
                }
                if($("#searchDetails").find(":focus").length > 0 ){
                    return;
                }
                self.setState({
                    showSearchDetails: false
                })
            })
        },
        showDetails : function() {
            this.setState({
                showSearchDetails : true
            });
        },
        login: function(e) {
            UserActions.login(this.refs, this.loginError);
        },
        loginError:function() {
            var self = this;
            $(this.refs.passwordLogin).addClass("invalid");
            setTimeout(function() {
                $(self.refs.passwordLogin).removeClass("invalid");
            }, 3000);
        },
        logout : function() {
            UserActions.logout();
        },
        signup: function() {
            if (!this.state.agreed){
                Materialize.toast("You need to agree to the terms and conditions to continue.", 1000);
            }
            else if(this.validateInput({
                    target : null
                })) {
                UserActions.signup(this.refs, this.signupFeedback);
            }

        },
        signupFeedback: function(message) {
            Materialize.toast(message, 5000);
        },
        validateInput: function(e) {
            var target = e.target;
            var error = false;
            if(e.target == null || target.id == "password") {
                var password = this.refs.password.value;
                if(password.length == 0){
                    $password = $(this.refs.password);
                    if(!$password.hasClass("invalid")) {
                        $password.addClass("invalid");
                        error = true;
                    }
                } else {
                    $password = $(this.refs.password);
                    $password.removeClass("invalid");
                    if(!$password.hasClass("valid")) {
                        $password.addClass("valid")
                    }
                }
            }
            if(e.target == null || target.id == "password_r") {
                var password = this.refs.password.value;
                var password_r = this.refs.password_r.value;
                if(password != password_r){
                    $passwordRepeat = $(this.refs.password_r);
                    if(!$passwordRepeat.hasClass("invalid")) {
                        $passwordRepeat.addClass("invalid");
                        error = true;
                    }
                } else {
                    $passwordRepeat = $(this.refs.password_r);
                    $passwordRepeat.removeClass("invalid");
                }
            }
            if(e.target == null || target.id == "phone") {
                var phone = this.refs.phone;
                $phone = $(phone);
                if(phone.value.match(/\+[0-9]{1,3}\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/g)) {
                    $phone.removeClass("invalid")
                    if(!$phone.hasClass("valid")) {
                        $phone.addClass("valid")
                    }
                } else {
                    $phone.removeClass("valid");
                    if(!$phone.hasClass("invalid")) {
                        $phone.addClass("invalid")
                    }
                    error = true;
                }
            }
            return !error;
        },
        toggleCart : function() {
            if(this.state.cartOpen) {
                $("#cart").animate({
                    right:"-460px"
                }, 500);
                $("#dark-cover").animate({
                    opacity: '0'
                }, 500, function() {
                    $("#dark-cover").css('display','none')
                });
                this.setState({
                    cartOpen:false
                })
            } else {
                $("#cart").animate({
                    right:"0px"
                }, 500)
                $("#dark-cover").css('display','block');
                $("#dark-cover").animate({
                    opacity: '0.7'
                }, 500);
                this.setState({
                    cartOpen:true
                })
            }
        },
        toggleCheck: function() {
            this.setState({
                agreed: !this.state.agreed
            }, function() {
                console.log(this.state);
            }.bind(this));
        },
        parameterize: function(params){
            var ret = [];
            for (var property in params) {
                if (params.hasOwnProperty(property)) {
                    ret.push(property + "=" + params[property]);
                }
            }
            return ret.join("&");
        },
        nextStep: function() {
            if (this.state.agreed){
                this.setState({
                    signupForm: true
                });
            }
            else {
                Materialize.toast("You need to agree to the terms and conditions to continue.", 5000);
            }

        },
        submitSearch : function(e) {
            var params = {}
            if(e.target.value.length != 0) {
                params.string = e.target.value;
            }
            if(this.refs.authorFilter.value.length != 0){
                params.author = this.refs.authorFilter.value;
            }
            if(this.refs.publisherFilter.value.length != 0){
                params.publisher = this.refs.publisherFilter.value;
            }
            if(this.refs.rating.value.length != 0){
                params.rating = this.refs.rating.value;
            }
            if(this.refs.fromyear.value.length != 0){
                params.fromYear = this.refs.fromyear.value;
            }
            if(this.refs.toyear.value.length != 0){
                params.toYear = this.refs.toyear.value;
            }
            if(this.refs.isbn.value.length != 0){
                params.isbn = this.refs.isbn.value;
            }
            var genres = this.props.stores.genres.getAll();
            var selectedGenres = [];
            var self = this;
            _.each(genres, function(genre) {
                var id = "genre_" + genre.name;
                if(self.refs[id].checked) {
                    selectedGenres.push(genre.id);
                }
            });
            if(selectedGenres.length > 0) {
                params.genres = selectedGenres;
            }
            if(e.keyCode == 13) {
                this.props.setView("view/searchResults/query?"+this.parameterize(params));
            }
        },
        gotoProfile : function() {
            this.props.setView("view/profile");
        },
        gotoHome : function() {
            this.props.setView("view/home");
        },
        gotoAdminDashboard : function() {
            this.props.setView("view/adminDashboard");
        },
        gotoFAQ : function() {
            this.props.setView("view/faq");
        },
        render: function() {
            var detailStyle = {};
            if(!this.state.showSearchDetails) {
                detailStyle = {
                    display: 'none'
                }
            }
            var searchDetails = (
                <div id="searchDetails" style={detailStyle} className="searchDetails container">
                    <div className="row">
                        <div className="col s12 m6 genre-filters">
                            {
                                _.map(this.props.stores.genres.getAll(), function(genre) {
                                    var id = "genre_" + genre.name;
                                    return (<p>
                                        <input type="checkbox"  id={id} ref={id} />
                                        <label htmlFor={id}>{genre.name}</label>
                                    </p>);
                                })
                            }
                        </div>
                        <div className="col s12 m6 search-filters">
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="authorFilter" id="Author" type="text" className="validate"/>
                                    <label htmlFor="Author">Author</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="publisherFilter" id="Publisher" type="text" className="validate"/>
                                    <label htmlFor="Publisher">Publisher</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <input ref="rating" id="rating" type="number" min="0" max="5" className="validate"/>
                                    <label tmlFor="rating">Rating</label>
                                </div>
                                <div className="input-field col s6">
                                    <input ref="isbn" id="isbn" type="number" className="validate"/>
                                    <label tmlFor="isbn">ISBN</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <input ref="fromyear" id="fromyear" type="text" className="validate"/>
                                    <label htmlFor="fromyear">From Year</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <input ref="toyear" id="toyear" type="text" className="validate"/>
                                    <label htmlFor="toyear">To Year</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            if(this.state.loggedIn) {
                var navItems = (<ul id="dropdown1" className="dropdown-content">
                    <li><a onClick={this.gotoProfile}>Profile</a></li>
                    <li><a onClick={this.gotoAdminDashboard}>Admin Dashboard</a></li>
                    <li><a onClick={this.gotoFAQ}>FAQ</a></li>
                    <li><a onClick={this.logout}>Logout</a></li>
                </ul>);
                var mobileItems = (
                    <ul className="side-nav" id="mobile-demo">
                        <li><a onClick={this.gotoProfile}>Profile</a></li>
                        <li><a onClick={this.gotoAdminDashboard}>Admin Dashboard</a></li>
                        <li><a onClick={this.gotoFAQ}>FAQ</a></li>
                        <li><a onClick={this.logout}>Logout</a></li>
                    </ul>
                )
            } else {
                var mobileItems = (<ul className="side-nav" id="mobile-demo">
                        <li><a href="#modalLogin" className="modal-trigger login-modal">Login</a></li>
                        <li><a onClick={this.gotoFAQ}>FAQ</a></li>
                    </ul>
                )
            }
            var style = {};
            if(this.props.showShadow == false) {
                style = {
                    'boxShadow': 'none'
                }
            }
            return(
                <div className="nav-wrapper-outer">
                    {navItems}
                    <nav style={style}>
                        <div className="white blue-grey-text text-darken-1 nav-wrapper">
                            <a href="#" onClick={this.gotoHome} className="left blue-grey-text text-darken-1 brand-logo hide-on-med-and-down">Logo</a>
                            <a href="#" data-activates="mobile-demo" className="blue-grey-text text-darken-1 button-collapse"><i className="material-icons">menu</i></a>
                            {this.state.loggedIn ? <a style={{padding:'0 5px'}} className="right blue-grey-text text-darken-1 shopping-cart-icon" onClick={this.toggleCart}><i className="material-icons">shopping_cart</i></a> : null}
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                {!this.state.loggedIn ? <li><a className="blue-grey-text text-darken-1" onClick={this.gotoFAQ}>FAQ</a><a  href="#modalLogin" className="blue-grey-text text-darken-1 modal-trigger login-modal">Login</a></li> : <li> <a className="blue-grey-text text-darken-1 dropdown-button" href="#!" data-activates="dropdown1"> Welcome<i className="material-icons right">arrow_drop_down</i></a></li>}
                            </ul>
                            <div onFocus={this.showDetails} className="nav-search">
                                <div className="input-field">
                                    <input id="search" type="search" placeholder="Search" autoComplete="off" onKeyDown={this.submitSearch} required/>
                                    <label htmlFor="search"><i className="grey-text material-icons">search</i></label>
                                    <i className="grey-text material-icons">close</i>
                                </div>
                            </div>
                            {mobileItems}
                        </div>
                    </nav>
                    {searchDetails}
                    <div id="modalLogin" className="modal">
                        <div className="modal-content container login">
                            <div className="row">
                                <div className="col s12">
                                    <ul className="tabs login">
                                        <li className="tab col s6"><a href="#loginTab">Login</a></li>
                                        <li className="tab col s6"><a href="#signupTab">Signup</a></li>
                                    </ul>
                                </div>
                                <div style={{paddingTop: '20px'}} id="loginTab" className="col s12">
                                    <h2 className="flow-text">Login</h2>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input ref="emailLogin" id="email" type="text"/>
                                            <label htmlFor="email">Email</label>
                                        </div>
                                        <div className="input-field col s12">
                                            <input ref="passwordLogin" id="password" type="password"/>
                                            <label htmlFor="password" data-error="Invalid username or password">Password</label>
                                        </div>
                                        <div className="col s12 buttons">
                                            <button onClick={this.login} className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                                                <i className="material-icons right">send</i>
                                            </button>
                                            <button className="btn waves-effect waves-light modal-action modal-close">Close
                                                <i className="material-icons right">clear</i>
                                            </button>
                                        </div>
                                        <div className="col s12">
                                            <span className="col s12">Not a member? Click <a href="/signup">here</a> to Sign up!</span>
                                        </div>
                                    </div>
                                </div>
                                <div id="signupTab" className="col s12 signup">
                                    <div>
                                        <div className="row contact header">
                                            <span>User Info </span>
                                            <i className="material-icons">info_outline</i>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12 m6">
                                                <input ref="first_name" id="first_name" type="text" className="validate"/>
                                                <label htmlFor="first_name">First Name</label>
                                            </div>
                                            <div className="input-field col s12 m6">
                                                <input ref="last_name" id="last_name" type="text" className="validate"/>
                                                <label htmlFor="last_name">Last Name</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input ref="email" id="email" type="email" className="validate"/>
                                                <label htmlFor="email">Email</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input onChange={this.validateInput} ref="phone" id="phone" type="tel" className="validate"/>
                                                <label data-error="Number must match format +x(xxx)-xxx-xxxx" htmlFor="phone">Phone</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <input ref="dob" id="dob" type="date" className="datepicker"/>
                                                <label htmlFor="dob">Date Of Birth</label>
                                            </div>
                                            <div className="input-field col s6">
                                                <input ref="gender" id="gender" type="text" className="validate"/>
                                                <label htmlFor="gender">Gender</label>
                                            </div>
                                        </div>

                                        <div className="row account header">
                                            <span>Account Info&nbsp;</span>
                                            <i className="material-icons">vpn_key</i>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12 m6">
                                                <input onChange={this.validateInput} ref="password" type="password" id="password"/>
                                                <label data-error="Password cannot be null" htmlFor="password">Password</label>
                                            </div>
                                            <div className="input-field col s12 m6">
                                                <input onChange={this.validateInput} ref="password_r" id="password_r" type="password"/>
                                                <label  data-error="Passwords dont match" data-success='Passwords match!'  htmlFor="password_r">Repeat Password</label>
                                            </div>
                                        </div>

                                        <div className="row address header">
                                            <span>Address Info </span>
                                            <i className="material-icons">home</i>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input ref="address" id="address" type="text" className="validate"/>
                                                <label htmlFor="address">Address</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <input ref="city" id="city" type="text" className="validate"/>
                                                <label htmlFor="city">City</label>
                                            </div>
                                            <div className="input-field col s12 m6">
                                                <input ref="state" id="state" type="text" className="validate"/>
                                                <label htmlFor="state">State</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12 m6">
                                                <input ref='zipCode' id="zipCode" type="number" min="0" max="999999" className="validate"/>
                                                <label htmlFor="zipCode">ZipCode</label>
                                            </div>
                                            <div className="input-field col s12 m6">
                                                <input ref="country" id="country" type="text" className="validate"/>
                                                <label htmlFor="country">Country</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <PolicyComponent />
                                        <form action="#">
                                            <p>
                                                <input type="checkbox" id="accept" onClick={this.toggleCheck}/>
                                                <label htmlFor="accept">I accept the terms and conditions.</label>
                                            </p>
                                        </form>
                                    </div>
                                    <div className="row col s12 buttons">
                                        <button onClick={this.signup} className="btn waves-effect waves-light" id='login' type="submit" name="action">Signup
                                            <i className="material-icons right">send</i>
                                        </button>
                                        <button className="btn waves-effect waves-light modal-action modal-close">Close
                                            <i className="material-icons right">clear</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
