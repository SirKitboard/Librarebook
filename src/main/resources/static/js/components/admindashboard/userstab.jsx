define([
    'underscore',
    'react',
    'jsx!components/template/book',
    'react-dom'
], function(_, React, Book, ReactDOM) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
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
                $('select').material_select();
            }
        },
        componentDidMount: function() {
            $('.modal-trigger.profile-modal').leanModal();
            $('select').material_select();
        },
        handleUpdate: function() {
            var self = this;
            var firstName = ReactDOM.findDOMNode(this.refs.first_name).value;
            var lastName = ReactDOM.findDOMNode(this.refs.last_name).value;
            var email = ReactDOM.findDOMNode(this.refs.email).value;
            var phone = ReactDOM.findDOMNode(this.refs.phone).value;
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
                    self.props.stores.users.updateUser(self.state.selectedUser);
                    $("#modalEditUser").closeModal();
                    self.forceUpdate();
                }
            })
        },
        render: function() {
            if (this.state.loadingUsers) {
                return (<div>hi</div>);
            }
            if (!this.state.selectedUser) {
                return (<div>loading</div>)
            }
            var user = this.state.selectedUser;
            var numBorrowed = user.checkoutHistory.length + user.currentlyCheckedOutItems.length;
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
                                <div className="col offset-s2 s8 offset-m1 m3 offset-l1 l2">
                                    <ul className="navigateTo">
                                        <li><i className="material-icons prefix">person</i>Profile</li>
                                        <li><i className="material-icons prefix">book</i>Wishlist</li>
                                        <li><i className="material-icons prefix">rate_review</i>Reviews</li>
                                    </ul>
                                </div>
                                <div className="col s12 m8 l9">
                                    <div className="row graph-wrapper">
                                        <div className="col s12">
                                            <img className="graph" src="http://placehold.it/500x300"/>
                                        </div>
                                    </div>
                                    <div className="row stats">
                                        <div className="col s12 m6">
                                            <p># of books borrowed</p>
                                            <h4>{numBorrowed}</h4>
                                        </div>
                                        <div className="col s12 m6">
                                            <p># of books rated</p>
                                            <h4>{user.ratings.length}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed-action-btn" style={{bottom: "45px", right: "40px"}}>
                        <a className="btn-floating btn-large red modal-trigger profile-modal" href="#modalEditUser">
                            <i className="large material-icons">mode_edit</i>
                        </a>
                        <ul>
                            <li><a className="btn-floating green deleteUser"><i className="material-icons">delete</i></a></li>
                            <li><a className="btn-floating blue addUser"><i className="material-icons">add</i></a></li>
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
                                    <input ref="first_name" id="first_name" type="text" className="validate" defaultValue={this.state.selectedUser.firstName}/>
                                    <label className="active" htmlFor="first_name">First Name</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <input ref="last_name" id="last_name" type="text" className="validate" defaultValue={this.state.selectedUser.lastName}/>
                                    <label className="active" htmlFor="last_name">Last Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="email" id="email" type="email" className="validate" defaultValue={this.state.selectedUser.email}/>
                                    <label className="active" htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input ref="phone" id="phone" type="tel" className="validate" defaultValue={this.state.selectedUser.phoneNumber} onChange={this.onPhoneChange}/>
                                    <label data-error="Invalid format, please use +x(xxx)xxx-xxxx" className="active" htmlFor="phone">Phone</label>
                                </div>
                            </div>
                            <div className="input-field">
                                <select ref="roleSelect">
                                    <option value="user" defaultValue={this.state.selectedUser.role == "user" ? "selected":""}>Admin</option>
                                    <option value="admin" defaultValue={this.state.selectedUser.role == "admin" ? "selected":""}>User</option>
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
                </div>
            )
        }
    });
})
