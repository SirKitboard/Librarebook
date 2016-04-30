define([
    'underscore',
    'react',
    'actions/books'
], function(_, React, BookActions) {
    return React.createClass({
        getInitialState: function(){
            // var liked = this.props.book.favorited;
            var self = this;
            var loggedIn = false;
            checkedOut = this.isCheckedOut(this.props.book);
            $(".modal-trigger.edit-modal").leanModal();
            $(".modal-trigger.share-modal").leanModal();
            return {
                'checkedOut': checkedOut
            }
        },
        isCheckedOut: function(book) {
            if (window.currentUser) {
                var id = window.currentUser.id;
                var checkedOutBy = book.checkedOutBy;
                var isCheckedOut = _.find(checkedOutBy, function(item) { return item.user == id; });
                if (isCheckedOut) {
                    return true;
                }
            }
            return false;
        },
        toggleFavorite : function() {
            var self = this;
            var book = this.props.book;
            BookActions.toggleFavorite(this.props.book);
        },
        checkout: function() {
            BookActions.checkout(this.props.book.id);
        },
        return: function() {
            BookActions.return(this.props.book.id);
        },
        purchase: function() {
            BookActions.purchase(this.props.book.id, this.props.book.isbn);
        },
        toggleRenew: function() {
            BookActions.toggleRenew(this.props.book.id);
        },
        renew: function () {
            BookActions.renew(this.props.book.id);
        },
        addHold: function() {
            BookActions.addHold(this.props.book.id);
        },
        removeHold: function() {
            BookActions.removeHold(this.props.book.id);
            console.log("clicked");
        },
        delete: function() {
            BookActions.delete(this.props.book.id);
        },
        componentDidMount : function() {
            $(".modal-trigger.editModalTrigger").leanModal();
            $(".modal-trigger.shareModalTrigger").leanModal();
        },
        componentWillUpdate: function(nextProps,nextState) {
            if (window.currentUser) {
                nextBook = nextProps.book;
                if (nextBook) {
                    isCheckedOut = this.isCheckedOut(nextBook);
                    if ("checkedOut" in nextBook) {
                        nextState.checkedOut = nextBook.checkedOut;
                    } else {
                        nextState.checkedOut = isCheckedOut;

                    }
                }
            } else {
                nextState.checkedOut = false;
            }
        },
        render: function() {
            var book = this.props.book;
            var user = window.currentUser;
            var authors = this.props.book.authors;
            var authorText = "";
            if (authors) {
                for (i=0; i<authors.length; i++) {
                    if (i + 1 < authors.length) {
                        authorText += authors[i].firstName + " " + authors[i].lastName + ", ";
                    } else {
                        authorText += authors[i].firstName + " " + authors[i].lastName;
                    }
                }
            }

            var purchaseButton = (<div className = "btn-large right bookButton" id="purchase" onClick={this.purchase}>Purchase</div>);
            if (this.state.checkedOut) {
                var checkedOutItem = _.find(book.checkedOutBy, function(item) { return item.user == user.id; });
                var dateCheckedOut = new Date(checkedOutItem.checkedOutOn);
                var dueDate = new Date(checkedOutItem.dueDate);
                var timeDiff = Math.abs(dueDate.getTime() - dateCheckedOut.getTime());
                var daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log(daysLeft);

                var checkoutInfo = (<p>Checked out on {dateCheckedOut.toDateString()} at {dateCheckedOut.toTimeString()}</p>);
                var returnInfo = (<p>Book will be returned {dueDate.toDateString()}</p>);
                var returnButton = (<div className = "btn-large right bookButton" id="return" onClick={this.return}>Return</div>);
                var downloadButton = (<div className = "btn-large right bookButton" id="Download">Download</div>);

                if (!checkedOutItem.renewed) {
                    if (checkedOutItem.willRenew) {
                        var checked = "checked";
                    }
                    if (daysLeft <= 3) {
                        var renewCheckbox =
                            (
                                <form className="left" action="#">
                                    <p>
                                        <input type="checkbox" id="renewCheckbox" checked={checked} onClick={this.toggleRenew}/>
                                        <label htmlFor="renewCheckbox">Renew Book</label>
                                    </p>
                                </form>
                            );
                    }
                }
            }


            var available = book.availableLicenses;
            if (available > 0) {
                var card =
                    (<div className="card green" id="bookAvailable">
                        <div className="card-content white-text">
                            <p className="center-align">Available</p>
                        </div>
                    </div>);
                var disabled = "";

                if (!this.state.checkedOut) {
                    var instantCheckout = (<div className= "btn-large right bookButton" id="instantCheckout" onClick={this.checkout}>Checkout</div>);
                    var addToCart = (<div className= "btn-large right bookButton"  id="addToCart">Add to cart</div>);
                }
            }else {
                var card =
                    (<div className="card red z-depth-1" id="bookAvailable">
                        <div className="card-content white-text">
                            <p className="center-align">Unavailable</p>
                        </div>
                    </div>);
                if (!this.state.checkedOut) {
                    var reserved;
                    var waitlistButton;
                    if (user) {
                        var reserved = _.find(user.holdItems, function(item) {
                            return item.id == book.id;
                        });
                    }
                    if (reserved) {
                        waitlistButton = (<div className= "btn-large right bookButton"  id="removeHold" onClick={this.removeHold}>Remove Hold</div>);
                    } else {
                        waitlistButton = (<div className= "btn-large right bookButton"  id="addHold" onClick={this.addHold}>Place Hold</div>);
                    }
                    var recommendButton = (<div className= "btn-large right bookButton"  id="recommendMore">Recommend</div>);
                    var disabled = "disabled";
                }
            }

            var bookActionButtons =
                (
                    <div>
                        {renewCheckbox}
                        {returnButton}
                        {instantCheckout}
                        {recommendButton}
                        {waitlistButton}
                        {purchaseButton}
                        {downloadButton}
                        {addToCart}
                    </div>
                );

            var likeStyle = {
                color: 'red',
                fontSize : '30px',
                margin: '10px'
            };

            var iconStyle = {
                fontSize : '30px',
                margin: '10px'
            };

            isWishlisted = function(book) {
                var wishlist = window.currentUser.wishlist;
                for (var i = 0, len=wishlist.length; i<len; i++) {
                    if (wishlist[i].id == book.id){
                        return true;
                    }
                }
                return false;
            };


            return (
                <div id="bookInfo">
                    <h2> {this.props.book.title} </h2>
                    <h5>by {authorText}</h5>
                    <p>{this.props.book.checkedOutOn}</p>
                    <div className="row">
                        <a><span style={likeStyle} onClick={this.toggleFavorite} className=""/></a>
                        {this.props.book.favorited ? <a><span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like-filled"/></a> : <span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like"/> }
                        {this.props.loggedIn ? <a href="#modalEditBook" className="modal-trigger editModalTrigger"><i style={iconStyle} className="material-icons">edit</i></a> : null}
                        <a href="#modalShare" className="modal-trigger shareModalTrigger "><i style={iconStyle} className="material-icons">share</i></a>
                        {!this.props.loggedIn ? null : isWishlisted(this.props.book) ? <a><i className="material-icons">playlist_add</i></a> :
                            <a><i className="material-icons">playlist_add</i></a>}
                        {card}
                    </div>
                    <p>ISBN: {this.props.book.isbn}</p>
                    <hr />
                    <p>Description</p>
                    <p>
                        {this.props.book.description}
                    </p>
                    <hr />
                    <span>
                        <p className="left-align">Year</p><p className="right-align">{this.props.book.yearPublished}</p>
                    </span>
                    <hr />
                    <span>
                        <p className="left-align">Publisher</p><p className="right-align">{this.props.book.publisher.name}</p>
                    </span>
                    <hr />
                    <span>
                        <p className="left-align">Rating</p><p className="right-align"></p>
                    </span>
                    <div>
                        {checkoutInfo}
                        {returnInfo}
                    </div>
                        { bookActionButtons }
                </div>
            )
        }
    });
})