define([
    'underscore',
    'react',
    'jsx!components/template/book',
    'jsx!components/base/userprofile',
    'jsx!components/widgets/bookCarousel',
    'react-dom',
    'actions/user'
], function(_, React, Book, UserProfileComponent, BookCarousel, ReactDOM, UserActions) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            return {
                loadingUsers: false
            }
        },
        onStoreUpdate: function() {
            if(this.state.users.length == 0) {
                var nextUsers = this.props.stores.users.getUsers();
                if(nextUsers.length > 0){
                    this.setState({
                        users: nextUsers,
                        loadingUsers: false
                    })
                }
            } else{
                var user = this.state.users[0];
                this.setState({
                    users: this.props.stores.users.getUsers(),
                    loadingUsers: false,
                    selectedUser: user
                });
            }
        },
        setUser: function(e) {
            var target = e.target;
            while(!target.classList.contains("cart-book")) {
                target = target.parentNode;
            }
            var userID = target.getAttribute("data-id");
            var user = this.props.stores.users.getUser(userID);
            this.setState({
                selectedUser: user
            })
        },
        componentWillMount: function() {
            var users = this.props.stores.users.getUsers();
            this.props.stores.users.addChangeListener(this.onStoreUpdate);
            if (users.length === 0) {
                this.setState({
                    users: users,
                    loadingUsers: true
                })
            } else {
                this.setState({
                    users: users,
                    loadingUsers: false
                })
            }
            if (!this.state.selectedUser) {
                this.setState({
                    selectedUser: users[0]
                })
            }
        },
        componentWillUnmount: function () {
            this.props.stores.books.removeChangeListener(this.onStoreUpdate)
        },
        componentDidUpdate: function (oldProps, oldState) {
            if(oldState.loadingUsers == true && this.state.loadingUsers == false) {
                $('.modal-trigger.profile-modal').leanModal();
                $('.modal-trigger.addUser').leanModal();
                $('.modal-trigger.deleteUser').leanModal();
                $('select').material_select();
                $('.collapsible').collapsible({});
                $('.datepicker').pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 60 // Creates a dropdown of 15 years to control year
                });
            }
        },
        componentDidMount: function() {
            $('.modal-trigger.profile-modal').leanModal();
            $('.modal-trigger.addUser').leanModal();
            $('.modal-trigger.deleteUser').leanModal();
            $('select').material_select();
            $('.collapsible').collapsible({});
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 60 // Creates a dropdown of 15 years to control year
            });
        },
        handleUpdate: function() {
            var self = this;
            var firstName = ReactDOM.findDOMNode(this.refs.first_name1).value;
            var lastName = ReactDOM.findDOMNode(this.refs.last_name1).value;
            var email = ReactDOM.findDOMNode(this.refs.email1).value;
            var phone = ReactDOM.findDOMNode(this.refs.phone1).value;
            var role = ReactDOM.findDOMNode(this.refs.roleSelect).value;
            if(phone && phone != "") {
                if (!phone.match(/\+[0-9]{1,3}\([0-9]{3}\)[0-9]{3}-[0-9]{4}/g)) {
                    $("#phone").addClass("invalid");
                    return;
                }
            }
            $.ajax({
                url:"/api/users/"+window.currentUser.id,
                method: "PUT",
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phone,
                    role: role
                },
                success : function(response) {

                    self.state.selectedUser.firstName = firstName;
                    self.state.selectedUser.lastName = lastName;
                    self.state.selectedUser.email = email;
                    self.state.selectedUser.phoneNumber = phone;
                    self.state.selectedUser.role = role;
                    console.log(response);
                    self.props.stores.users.updateUser(response);
                    $("#modalEditUser").closeModal();
                    self.forceUpdate();
                }
            })
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
        signup: function() {
            if(this.validateInput({
                    target : null
                })) {
                UserActions.signup(this.refs, this.signupFeedback);
            }

        },
        signupFeedback: function(message) {
            Materialize.toast(message, 5000);
            $("#modalCreateUser").closeModal();
        },
        deleteUser: function() {
            UserActions.delete(this.state.selectedUser.id);
        },
        render: function() {
            if (this.state.loadingUsers) {
                return (<div>hi</div>);
            }
            if (this.state.selectedUser) {
                var user = this.state.selectedUser;
                var numBorrowed = user.checkoutHistory.length + user.currentlyCheckedOutItems.length;
                var userInfo =
                    (
                        <div className="col s12 m9 userDetails">
                            <div className="coverPic">
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col offset-s1 s3 offset-m1 m3 offset-l1 l2">
                                        <img className="propic z-depth-1" src="http://placehold.it/200x200"/>
                                    </div>
                                    <div className="col s5  l6">
                                        <h4 className="username">{user.firstName} {user.lastName}</h4>
                                        <h5 className="user-role">{user.role}</h5>
                                        <h6 className="user-email">Email : <a href="mailto:xxx@xx.com">{user.email}</a></h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <ul className="collapsible" data-collapsible="accordion">
                                        <li>
                                            <div className="collapsible-header"><i className="material-icons">lock</i>Books you are currently enjoying</div>
                                            <div className="collapsible-body">{this.state.selectedUser.currentlyCheckedOutItems.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getCheckedOutbooks(this.state.selectedUser.currentlyCheckedOutItems)}/>: <h5 style={{margin:'20px'}}>No checked out items</h5>}</div>
                                        </li>
                                        <li>
                                            <div className="collapsible-header"><i className="material-icons">history</i>Books you have borrowed in the past</div>
                                            <div className="collapsible-body">{this.state.selectedUser.checkoutHistory.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getCheckoutHistory()} />: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                                        </li>
                                        <li>
                                            <div className="collapsible-header"><i className="material-icons">star_rate</i>Books you have rated</div>
                                            <div className="collapsible-body">{this.state.selectedUser.ratings.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getRatedBooks()} />: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                                        </li>
                                        <li>
                                            <div className="collapsible-header"><i className="material-icons">favorite</i>Books you've favorited</div>
                                            <div className="collapsible-body"><BookCarousel books={this.state.selectedUser.favorites}/></div>
                                        </li>
                                        <li>
                                            <div className="collapsible-header"><i className="material-icons">bubble_chart</i>Books you've wished for</div>
                                            <div className="collapsible-body"><BookCarousel setView={this.props.setView}books={this.state.selectedUser.wishlist}/></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
            }
            var self = this;
            return (
                <div id="usersTab" className="row">
                    <div className="col s12 m3 userList">
                        <div className="input-field">
                          <i className="material-icons prefix">search</i>
                          <input id="search" type="text" className="validate"/>
                          <label htmlFor="search">Search</label>
                        </div>
                        <ul>
                            {
                                _.map(this.state.users, function(user) {
                                    return (
                                        <li>
                                            <Book book={user} id={user.id} setUser={self.setUser}/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {userInfo}
                    <div className="fixed-action-btn" style={{bottom: "45px", right: "40px"}}>
                        <a className="btn-floating btn-large red modal-trigger profile-modal" href="#modalEditUser">
                            <i className="large material-icons">mode_edit</i>
                        </a>
                        <ul>
                            <li><a className="btn-floating green modal-trigger deleteUser" href="#modalDeleteUser"><i className="material-icons">delete</i></a></li>
                            <li><a className="btn-floating blue modal-trigger addUser" href="#modalCreateUser"><i className="material-icons">add</i></a></li>
                        </ul>
                    </div>
                    <div id="modalEditUser" className="modal">
                        <div className="modal-content">
                            <div className="row">
                                <h4>Update profile</h4>
                            </div>

                            <div className="row contact header">
                                <span>Contact Info </span>
                                <i className="material-icons">info_outline</i>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <input ref="first_name1" id="first_name" type="text" className="validate" defaultValue={this.state.selectedUser.firstName}/>
                                    <label className="active" htmlFor="first_name">First Name</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <input ref="last_name1" id="last_name" type="text" className="validate" defaultValue={this.state.selectedUser.lastName}/>
                                    <label className="active" htmlFor="last_name">Last Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="email1" id="email" type="email" className="validate" defaultValue={this.state.selectedUser.email}/>
                                    <label className="active" htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="phone1" id="phone" type="tel" className="validate" defaultValue={this.state.selectedUser.phoneNumber} onChange={this.onPhoneChange}/>
                                    <label data-error="Invalid format, please use +x(xxx)xxx-xxxx" className="active" htmlFor="phone">Phone</label>
                                </div>
                            </div>
                            <div className="input-field">
                                <select ref="roleSelect" defaultValue={this.state.selectedUser.role}>
                                    <option value="user" >User</option>
                                    <option value="admin" >Admin</option>
                                </select>
                                <label>Roles</label>
                            </div>
                            <button onClick={this.handleUpdate} className="btn waves-effect waves-light button-right"
                                    id='login' type="submit" name="action">
                                <span>Submit</span>
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                    <div id="modalCreateUser" className="modal">
                        <div className="modal-content signup" id="signupTab">
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
                    <div id="modalDeleteUser" className="modal">
                        <div className="modal-content">
                            Are you sure you wish to delete this user?
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat " >Cancel</a>
                            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat " onClick={this.deleteUser}>Agree</a>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
