define([
    'underscore',
    'react',
    'jsx!components/template/book'
], function(_, React, Book) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            return {
                selectedBook: 0
            }
        },
        onStoreUpdate: function() {
            if(this.state.users.length == 0) {
                var nextUsers = this.props.stores.users.getUsers();
                console.log(this.props.stores.users);
                if(nextUsers.length > 0){
                    this.setState({
                        users: nextUsers,
                        loadingUsers: false
                    })
                }
            } else{
                this.setState({
                    loadingUsers: false
                });
            }
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
                    user: users,
                    loadingUsers: false
                })
            }
        },
        componentWillUnmount: function () {
            this.props.stores.books.removeChangeListener(this.onStoreUpdate)
        },
        render: function() {
            if (this.state.loadingUsers) {
                return (<div>hi</div>);
            }
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
                                            <Book book={user}/>
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
                                    <h4 className="username">Username</h4>
                                    <h5 className="user-role">Role</h5>
                                    <h6 className="user-email">Email : <a href="mailto:xxx@xx.com">email@mail.com</a></h6>
                                </div>
                                <div className="col s3 l3">
                                    <a className="btn waves-effect waves-light">Go To Page</a>
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
                                        <div className="col s12 m4">
                                            <p># of books borrowed</p>
                                            <h4>15</h4>
                                        </div>
                                        <div className="col s12 m4">
                                            <p># of books reviewed</p>
                                            <h4>10</h4>
                                        </div>
                                        <div className="col s12 m4">
                                            <p>Reputation</p>
                                            <h4>20</h4>
                                        </div>
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
