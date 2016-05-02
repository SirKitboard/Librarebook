define([
    'underscore',
    'react',
    'jsx!components/widgets/bookCarousel',
    'jsx!components/widgets/recommendationCarousel',
    'jsx!components/userprofile/updateUserProfile',
    'jsx!components/widgets/adContainer',
    'actions/books',
    'actions/user'
], function(_, React,BookCarousel, RecomCarousel, UpdateUserProfile, AdComponent, BookActions, UserActions) {
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
                random: array[random].item,
                existingRecommended: _.filter(window.currentUser.recommendedBooks, function(book) {return book.item != 0}),
                newRecommended: _.filter(window.currentUser.recommendedBooks, function(book) {return book.item == 0})
            }
        },
        updateRecommendations: function() {
            $("#newRecommendationModal").closeModal();
            this.setState({
                existingRecommended: _.filter(window.currentUser.recommendedBooks, function(book) {return book.item != 0}),
                newRecommended: _.filter(window.currentUser.recommendedBooks, function(book) {return book.item == 0})
            })
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
        createRecommendation: function() {
            var data = {
                book: this.refs.bookName.value,
                author: this.refs.authorName.value
            }
            var self = this;
            BookActions.recommendNewBook(data, this.updateRecommendations)
        },
        setPreferences: function() {
            var maturity = $("#maturitySelect").val();
            var durationSelect = $("#durationSelect").val();
            
            var data = {
                maxMaturity: maturity,
                duration: durationSelect
            }
            UserActions.update(window.currentUser.id, data, null);
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
                             <div className="collapsible-header"><i className="material-icons">rate_review</i>Recommended Books</div>
                             <div className="collapsible-body">{this.props.stores.books.getRecommended(this.state.random) != 0 ? <BookCarousel books={this.props.stores.books.getRecommended(this.state.random)}/>: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                         </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">rate_review</i>Books you requested more stock for</div>
                             <div className="collapsible-body">{this.state.existingRecommended.length > 0 ? <RecomCarousel books={this.state.existingRecommended} stores={this.props.stores}/>: <h5 style={{margin:'20px'}}>No items</h5>}</div>
                         </li>
                         <li>
                             <div className="collapsible-header"><i className="material-icons">rate_review</i>Books you Recommended</div>
                             <div className="collapsible-body">{this.state.newRecommended.length > 0 ? (
                                 <div style={{position: 'relative'}}className="container">
                                     <ul className="collection">
                                     {
                                         _.map(this.state.newRecommended, function(item) {
                                             var status = null;
                                             if(item.status == 1) {
                                                 status = <span className="secondary-content green-text"><i data-id={item.id} className="material-icons">check</i></span>
                                             }
                                             if(item.status == -1) {
                                                 status = <span className="secondary-content red-text"><i data-id={item.id} className="material-icons">close</i></span>
                                             }
                                             return (<li className="collection-item">
                                                 {item.bookName} by {item.authorName}
                                                 {status}
                                             </li>)
                                         })
                                     }
                                     </ul>
                                     <a href="#newRecommendationModal" style={{position:'absolute', right:'-15px', bottom:'4px'}} className="btn waves-effect waves-light modal-trigger profile-modal"><i className="material-icons">add</i></a>
                                 </div>
                             ): <h5 style={{margin:'20px'}}>No items<a href="#newRecommendationModal" className="btn right waves-effect waves-light modal-trigger profile-modal"><i className="material-icons">add</i></a></h5>}</div>
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
                    <div id="newRecommendationModal" className="modal">
                        <div className="modal-content container">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input ref="bookName" id="bookName" type="text" className="validate"/>
                                    <label htmlFor="bookName">Book Title</label>
                                </div>
                                <div className="input-field col s6">
                                    <input ref="authorName" id="authorName" type="text" className="validate"/>
                                    <label htmlFor="authorName">Author</label>
                                </div>
                            </div>
                            <div className="row">
                                <a onClick={this.createRecommendation} className="btn waves-effect waves-light col s6 offset-s3">Submit</a>
                            </div>
                        </div>
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
                                <div className="input-field col 6">
                                    <select id="maturitySelect" defaultValue={window.currentUser.preferences ?  window.currentUser.preferences.maxMaturity + "" : ""}>
                                        <option disabled value="">Choose your option</option>
                                        <option value="0">Kids</option>
                                        <option value="1">Young Adults</option>
                                        <option  value="2">Adults</option>
                                    </select>
                                    <label htmlFor="maturitySelect">Select global search preference</label>
                                </div>
                                <br></br>
                                <div className="input-field col 6">
                                    <select id="durationSelect" defaultValue={window.currentUser.preferences ?  window.currentUser.preferences.checkoutLength + "" : ""}>
                                        <option disabled value="">Choose your option</option>
                                        <option  value="3">3 days</option>
                                        <option  value="5">5 days</option>
                                        <option  value="7">7 days</option>
                                    </select>
                                    <label htmlFor="durationSelect">Select lending period preference</label>
                                </div>
                                <button onClick={this.setPreferences} className="btn waves-effect waves-light" id='submitPreferences' type="submit" name="action">Submit
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
