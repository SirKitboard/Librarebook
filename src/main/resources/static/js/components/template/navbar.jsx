define([
    "underscore",
    "react",
    'jsx!components/template/shoppingcart',
    'react-dom'
], function(_, React, ShoppingCartComponent, ReactDOM) {
    return React.createClass({
        getInitialState: function(){
            // debugger;
            var loggedIn = false
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
                showSearchDetails: false
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
        },
        showDetails : function() {
            this.setState({
                showSearchDetails : true
            });
        },
        hideDetails : function() {
            this.setState({
                showSearchDetails : false
            });
            // $("#searchDetails").css('display', 'none')
        },
        login: function(e) {
            var email = $(this.refs.emailLogin).val();
            var password = $(this.refs.passwordLogin).val();
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
                }
            })
        },
        logout : function() {
            $.ajax({
                url:"/api/logout",
                method: "POST",
                success: function() {
                    window.location.reload();
                }
            })
        },
        toggleCart : function() {
            if(this.state.cartOpen) {
                $("#cart").animate({
                    right:"-450px"
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
                $("#dark-cover").css('display','block')
                $("#dark-cover").animate({
                    opacity: '0.7'
                }, 500);
                this.setState({
                    cartOpen:true
                })
            }
        },
        submitSearch : function(e) {
            if(e.keyCode == 13) {
                this.props.setView({
                    view: 'searchResults',
                    query: e.target.value
                })
            }
        },
        gotoProfile : function() {
            this.props.setView({
                view: 'profile'
            });
        },
        gotoHome : function() {
            this.props.setView({
                view: 'home'
            })
        },
        gotoAdminDashboard : function() {
            this.props.setView({
                view: 'adminDashboard'
            });
        },
        render: function() {
            var searchDetails = "";
            if(this.state.showSearchDetails) {
                var searchDetails = (
                    <div id="searchDetails" className="searchDetails container">
                        <div className="row">
                            <div className="col s12 m6 genre-filters input-field">
                                <p>
                                  <input type="checkbox" id="genre_fiction" />
                                  <label htmlFor="genre_fiction">Fiction</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_youngadult"/>
                                  <label htmlFor="genre_youngadult">Young Adult</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_mature"/>
                                  <label htmlFor="genre_mature">Mature</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_biography"/>
                                  <label htmlFor="genre_biography">Biography</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_sci-fi"/>
                                  <label htmlFor="genre_sci-fi">Science Fiction</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_mystery"/>
                                  <label htmlFor="genre_mystery">Mystery</label>
                                </p>
                                <p>
                                  <input type="checkbox" id="genre_romance"/>
                                  <label htmlFor="genre_romance">Romance</label>
                                </p>

                            </div>
                            <div className="col s12 m6 search-filters">
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input ref="Author" id="Author" type="text" className="validate"/>
                                        <label htmlhtmlFor="Author">Author</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input ref="fromyear" id="fromyear" type="text" className="validate"/>
                                        <label htmlhtmlFor="fromyear">From Year</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input ref="toyear" id="toyear" type="text" className="validate"/>
                                        <label htmlhtmlFor="toyear">To Year</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input ref="rating" id="rating" type="number" min="0" max="5" className="validate"/>
                                        <label htmlhtmlFor="rating">Rating</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            if(this.state.loggedIn) {
                var navItems = (<ul id="dropdown1" className="dropdown-content">
                      <li><a onClick={this.gotoProfile} href="#">Profile</a></li>
                      <li><a onClick={this.gotoAdminDashboard} href="#!">Admin Dashboard</a></li>
                      <li><a onClick={this.logout} href="#">Logout</a></li>
                    </ul>)
                var mobileItems = (
                    <ul className="side-nav" id="mobile-demo">
                        <li><a onClick={this.gotoProfile} href="#!">Profile</a></li>
                        <li><a onClick={this.gotoAdminDashboard} href="#!">Admin Dashboard</a></li>
                        <li><a onClick={this.logout} href="#">Logout</a></li>
                    </ul>
                )
            } else {
                var mobileItems = (<ul className="side-nav" id="mobile-demo">
                        <li><a href="#modalLogin" className="modal-trigger login-modal">Login</a></li>
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
                            {!this.state.loggedIn ? <li><a  href="#modalLogin" className="blue-grey-text text-darken-1 modal-trigger login-modal">Login</a></li> : <li> <a className="blue-grey-text text-darken-1 dropdown-button" href="#!" data-activates="dropdown1"> Welcome Name<i className="material-icons right">arrow_drop_down</i></a></li>}
                        </ul>
                        <div onFocus={this.showDetails} onBlur={this.hideDetails} className="nav-search">
                            <div className="input-field">
                                <input id="search" type="search" placeholder="Search" onKeyDown={this.submitSearch} required/>
                                <label htmlthtmlFor="search"><i className="grey-text material-icons">search</i></label>
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
                                            <input ref="emailLogin" id="email" type="text" className="validate"/>
                                            <label htmlFor="email">Email</label>
                                        </div>
                                        <div className="input-field col s12">
                                            <input ref="passwordLogin" id="password" type="password" className="validate" data-error="Invalid username or password"/>
                                            <label htmlFor="password">Password</label>
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
                                    <div className="row contact header">
                                        <span>Contact Info </span>
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
                                            <input ref="phone" id="phone" type="tel" className="validate"/>
                                            <label htmlFor="phone">Phone</label>
                                        </div>
                                    </div>

                                    <div className="row account header">
                                        <span>Account Info&nbsp;</span>
                                        <i className="material-icons">vpn_key</i>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input ref="username" id="username" type="text" className="validate"/>
                                            <label htmlFor="username">Username</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input ref="password" type="password" id="password"/>
                                            <label htmlFor="password">Password</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input data-error="Passwords dont match" data-success='Passwords match!' ref="password_r" id="password_r" type="password"/>
                                            <label htmlFor="password_r">Repeat Password</label>
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
                                        <div className="input-field col s12">
                                            <input ref="city" id="city" type="text" className="validate"/>
                                            <label htmlFor="city">City</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input ref="state" id="state" type="text" className="validate"/>
                                            <label htmlFor="state">State</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input ref='zipCode' id="zipcode" type="number" className="validate"/>
                                            <label htmlFor="zipCode">ZipCode</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <span className="payment header">Payment <i className="material-icons">payment</i> </span>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input ref="creditCardNumber" id="ccn" type="text" className="validate"/>
                                            <label htmlFor="creditCardNumber">Credit Card Number</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <button onClick={this.toggleLogin} className="btn waves-effect waves-light" id='login' type="submit" name="action">Signup
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
