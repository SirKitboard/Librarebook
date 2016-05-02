define([
    'underscore',
    'react',
    'actions/books',
    'jsx!components/widgets/bookCarousel'
], function(_, React, BookActions, BookCarousel) {
    return React.createClass({
        componentDidMount: function() {
            $('ul.tabs').tabs();
            $(".modal-trigger.ratingModalTrigger").leanModal();
        },
        deleteRating: function() {
            BookActions.deleteRating(this.props.book.id);
        },
        render: function() {
            var imageURL = "http://placehold.it/500x700";
            if(this.props.book.coverImageUrl && this.props.book.coverImageUrl.length > 0) {
                imageURL = this.props.book.coverImageUrl;
            }
            var ratings = this.props.book.ratings;
            var numRatings = ratings.length;
            var buttonMessage = "Rate Book";
            if (ratings.length > 0 && this.props.loggedIn) {
                var itemRating = _.find(ratings, function (rating) {
                    return rating.user === window.currentUser.id;
                });
                if (itemRating) {
                    buttonMessage = "Edit Rating";
                    var deleteRatingButton = (<div className="btn" onClick={this.deleteRating}>Delete Rating</div>);
                    var userReview =
                        (
                          <div>
                              <p>My Rating</p>
                              <p className="ratingText">{this.props.book.rating.toFixed(1)}</p>
                          </div>
                        );
                }
            }

            var recommendedBooks =
                (
                    <div className="books">
                        <BookCarousel setView={this.props.setView} books={this.props.recommended}/>
                    </div>
                );
            var modalLink;
            if (this.props.loggedIn) {
                modalLink = "#modalReview";
            } else {
                modalLink = "#modalLogin";
            }
            return (
                <div>
                    <div className="row tab-row">
                        <div className="col s12">
                          <ul className="tabs">
                            <li className="tab col s6"><a className="active" href="#imagesTab">Images</a></li>
                            <li className="tab col s6"><a href="#reviewsTab">Reviews</a></li>
                          </ul>
                        </div>
                        <div id="imagesTab" className="col s12 valign-wrapper">
                            <img style={{width:'500px', height:'auto'}} src={imageURL} className="valign"/>
                        </div>
                        <div id="reviewsTab" className="col s12">
                            <div className="row rating">
                                <div id="ratingsLeft" className="col s3 valign-wrapper">
                                    <div>
                                        <p className="center-align">Average Rating</p>
                                        <p id="avgRating" className="ratingText center-align">{ratings.length > 0 ? this.props.book.rating.toFixed(1) : 0}</p>
                                        <p id="ratingsCount" className="center-align">{numRatings} total</p>
                                    </div>
                                </div>
                                <div id="ratingsRight" className="col s9">
                                    {userReview}
                                    <a href={modalLink} className="modal-trigger ratingModalTrigger btn">{buttonMessage}</a>
                                    {deleteRatingButton}
                                </div>
                            </div>
                            <hr/>
                            <div id="recommendations">
                                <h5>Recommended Titles</h5>
                                {recommendedBooks}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
