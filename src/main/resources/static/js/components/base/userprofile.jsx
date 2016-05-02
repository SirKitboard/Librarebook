define([
    'underscore',
    'react',
    'jsx!components/widgets/bookCarousel',
    'jsx!components/userprofile/updateUserProfile',
    'jsx!components/widgets/adContainer',
    'stores/books'
], function(_, React,BookCarousel,UpdateUserProfile, AdComponent, BooksStore) {
    return React.createClass({
        getInitialState : function() {
            var array = window.currentUser.checkoutHistory.concat(window.currentUser.currentlyCheckedOutItems);
            var random = Math.floor(Math.random() * array.length);
            this.props.stores.books.getRecommendedOrPull(array[random].item);
            var book = {
                title: null,
                description: null,
                authors : []
            }
            books = [book, book, book, book, book, book]
            return {
                books: books,
                random: array[random].item
            }
        },
        componentDidMount : function() {
            var self = this;
            $('.collapsible').collapsible({});
            $('.modal-trigger.profile-modal').leanModal();
            $('#maturitySelect').material_select();
            $('#durationSelect').material_select();

        },
        editingComplete : function() {
            $("#modalEditUser").closeModal();
            this.forceUpdate();
        },
        render: function() {
            var profileInfo = "";
            var imageURL = "http://placehold.it/200x200"

            profileInfo = (
                <div className="profile-and-stats row">
                    <div className="col s12 m6 row profile">

                        <div className="col s8 greeting">
                        <h3>{window.currentUser.firstName} {window.currentUser.lastName}</h3>
                        <img className="activator" src = {imageURL}/>
                            <div className="button-rating">
                                <span className="amber-text text-lighten-2 rating">
                                     <i className="material-icons">star</i>
                                </span>

                                <div>

                                    <a href="#modalEditUser" className="modal-trigger profile-modal waves-effect waves-light btn">Update Profile</a>
                                    <br/>
                                    <a href="#preferencesModal" className="modal-trigger profile-modal waves-effect waves-light btn">Preferences</a>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col s12 m6 right-align">
                        <h5>Stats</h5>
                        You Borrowed <span className="bold green-text"></span><br/>
                        You Reviewed <span className="bold green-text"></span><br/>
                        You Currently Checked Out <span className="bold green-text"></span><br/>

                    </div>
                </div>
            );
            console.log(this.state.random);
            console.log(this.props.stores.books.getRecommended(this.state.random));
            return (
                <div className="container" style={{width:'90%', maxWidth:'none', marginTop: '80px'}}>
                    <div className="profile-card z-depth-1">
                        {profileInfo}
                    </div>
                    <div className="row">
                        <AdComponent orientation="horizontal"/>
                    </div>
                    <h5>User History</h5>
                     <ul className="collapsible" data-collapsible="accordion">
                         <li>
                             <div className="collapsible-header"><i className="material-icons">lock</i>Books you are currently enjoying</div>
                             <div className="collapsible-body">{window.currentUser.currentlyCheckedOutItems.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getCheckedOutbooks()}/>: <h5 style={{margin:'20px'}}>No checked out items</h5>}</div>
                         </li>
                        <li>
                          <div className="collapsible-header"><i className="material-icons">lock</i>Books you have borrowed in the past</div>
                            <div className="collapsible-body">{window.currentUser.checkoutHistory.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getCheckoutHistory()} />: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                        </li>
                        <li>
                          <div className="collapsible-header"><i className="material-icons">rate_review</i>Books you have rated</div>
                            <div className="collapsible-body">{window.currentUser.ratings.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getRatedBooks()} />: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                        </li>
                        <li>
                          <div className="collapsible-header"><i className="material-icons">rate_review</i>Books you have reviewed</div>
                          <div className="collapsible-body"><BookCarousel books={this.state.books}/></div>
                        </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">rate_review</i>Recommended Books</div>
                             <div className="collapsible-body">{this.props.stores.books.getRecommended(this.state.random) != 0 ? <BookCarousel books={this.props.stores.books.getRecommended(this.state.random)}/>: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                         </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">lock</i>Books you have reserved</div>
                             <div className="collapsible-body">{window.currentUser.holdItems.length != 0 ? <BookCarousel setView={this.props.setView}books={this.props.stores.books.getHeldBooks()} />: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                         </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">library_books</i>Books you've favorited</div>
                             <div className="collapsible-body"><BookCarousel books={window.currentUser.favorites}/></div>
                         </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">library_books</i>Books you've wished for</div>
                             <div className="collapsible-body"><BookCarousel setView={this.props.setView}books={window.currentUser.wishlist}/></div>
                         </li>
                    </ul>
                    <div className="fixed-action-btn">
                        <a className="btn-floating btn-large red modal-trigger profile-modal" href="#confirmationModal">
                            <i className="large material-icons">not_interested</i>
                        </a>
                    </div>
                     <div id="confirmationModal" className="modal">
                         <div className="modal-content container">
                            <div className="col s12">
                                Are you sure you want to deactivate your account?
                            </div>
                            <div className="input-field col s12">
                                <input id="password" type="password" className="validate" data-error="Invalid username or password"/>
                                <label htmlFor="password">Password</label>
                            </div>
                             <div className="col s12 buttons" style={{display: 'flex','justify-content': 'space-around', marginBottom: '10px'}}>
                                 <button className="btn waves-effect waves-light" id='login' type="submit" name="action">Submit
                                   <i className="material-icons right">send</i>
                                 </button>
                                 <button className="btn waves-effect waves-light modal-action modal-close">Close
                                   <i className="material-icons right">clear</i>
                                 </button>
                             </div>
                         </div>
                     </div>
                    <div id="preferencesModal" className="modal">
                        <div className="modal-content container">
                            <div className="col s12">
                                <label>Select global search preference</label>
                                <div className="input-field col s12">
                                <select id="maturitySelect">
                                    <option value="">Choose your option</option>
                                    <option value="1">Kids</option>
                                    <option value="2">Young Adults</option>
                                    <option value="3">Adults</option>
                                </select>

                                </div>
                                <button className="btn waves-effect waves-light" id='submitPreferences' type="submit" name="action">Submit
                                    <i className="material-icons right">send</i>
                                </button>


                            </div>
                        </div>
                    </div>
                    <UpdateUserProfile onCloseEditModal={this.editingComplete} user={window.currentUser}/>
                </div>
            );
        }
    });
})
