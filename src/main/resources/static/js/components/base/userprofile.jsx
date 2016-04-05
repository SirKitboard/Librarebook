define([
    'underscore',
    'react',
    'jsx!components/widgets/bookCarousel'
], function(_, React,BookCarousel) {
    return React.createClass({
        getInitialState : function() {
             var book = {
                title: null,
                description: null,
                author: null
            }
            books = [book, book, book, book, book, book]
            return {
                books: books
            }
        },
        componentDidMount : function() {
            $('.collapsible').collapsible({
              accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });
            $(".modal-trigger").leanModal();
        },
        render: function() {
        var profileInfo = "";
        var imageURL = "http://placehold.it/200x200"

        profileInfo = (
                    <div className="profile-and-stats row">
                        <div className="col s12 m6 row profile">

                            <div className="col s8 greeting">
                            <h3>firstName lastName</h3>
                            <img className="activator" src = {imageURL}/>
                                <div className="button-rating">
                                    <span className="amber-text text-lighten-2 rating">
                                         <i className="material-icons">star</i>
                                    </span>
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
                )

        return (
                <div className="container" style={{width:'90%', maxWidth:'none'}}>
                    <div className="profile-card z-depth-1">
                        {profileInfo}
                    </div>
                    <h5>User History</h5>
                     <ul className="collapsible" data-collapsible="accordion">
                        <li>
                          <div className="collapsible-header"><i className="material-icons">lock</i>Books you have borrowed </div>
                          <div className="collapsible-body"><BookCarousel books={this.state.books}/></div>
                        </li>
                        <li>
                          <div className="collapsible-header"><i className="material-icons">rate_review</i>Books you have reviewed</div>
                          <div className="collapsible-body"><BookCarousel books={this.state.books}/></div>
                        </li>
                        <li>
                          <div className="collapsible-header"><i className="material-icons">library_books</i>Books you are currently enjoying</div>
                          <div className="collapsible-body"><BookCarousel books={this.state.books}/></div>
                        </li>
                    </ul>
                    <div className="fixed-action-btn">
                       <a className="btn-floating btn-large red modal-trigger" href="#confirmationModal">
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
                </div>
            );
        }
    });
})
