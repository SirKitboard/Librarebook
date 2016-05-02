define([
    'underscore',
    'react',
    'actions/books',
], function(_, React, BookActions) {
    return React.createClass({
        getInitialState: function(){
            // var liked = this.props.book.favorited;
            checkedOut = this.isCheckedOut(this.props.book);
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
        isWishlisted: function() {
            var book = this.props.book;
            var wishlist = window.currentUser.wishlist;
            for (var i = 0, len = wishlist.length; i < len; i++) {
                if (wishlist[i].id == book.id) {
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
        toggleWishlist: function() {
            BookActions.toggleWishlist(this.props.book.id, this.showSuccessToast, this.showErrorToast);
        },
        showSuccessToast: function(message) {
            Materialize.toast(message, 5000);
        },
        showErrorToast: function(message) {
            Materialize.toast(message, 5000);
        },
        componentDidMount : function() {
            $(".modal-trigger.editModalTrigger").leanModal();
            $(".modal-trigger.shareModalTrigger").leanModal();
            $('#actionsDropdown').dropdown();
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

            var purchaseButton = (<li><a onClick={this.purchase}>Purchase</a></li>);
            if (this.state.checkedOut) {
                var checkedOutItem = _.find(book.checkedOutBy, function(item) { return item.user == user.id; });
                var dateCheckedOut = new Date(checkedOutItem.checkedOutOn);
                var dueDate = new Date(checkedOutItem.dueDate);
                var timeDiff = Math.abs(dueDate.getTime() - dateCheckedOut.getTime());
                var daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                console.log(daysLeft);

                var checkoutInfo = (<p>Checked out on {dateCheckedOut.toDateString()} at {dateCheckedOut.toTimeString()}</p>);
                var returnInfo = (<p>Book will be returned {dueDate.toDateString()}</p>);
                var returnButton = (<li><a onClick={this.return}>Return</a></li>);
                var downloadButton = (<li><a>Download</a></li>);

                if (!checkedOutItem.renewed) {
                    if (checkedOutItem.willRenew) {
                        var checked = "checked";
                    }
                    if (daysLeft <= 3) {
                        var renewCheckbox =
                            (
                                <li className="left" action="#">
                                        <input type="checkbox" id="renewCheckbox" checked={checked} onClick={this.toggleRenew}/>
                                        <label htmlFor="renewCheckbox">Renew Book</label>
                                </li>
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
                    var instantCheckout = (<li><a onClick={this.checkout}>Checkout</a></li>);
                    var addToCart = (<li><a>Add to cart</a></li>);
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
                        console.log(user.holdItems);
                        console.log(this.props.book.holdsBy);
                        var reserved = _.find(user.holdItems, function(hold) {
                            return hold.item == book.id;
                        });
                    }
                    if (reserved) {
                        waitlistButton = (<li><a onClick={this.removeHold}>Remove Hold</a></li>);
                    } else {
                        waitlistButton = (<li><a onClick={this.addHold}>Place Hold</a></li>);
                    }
                    var recommendButton = (<li><a>Recommend</a></li>);
                    var disabled = "disabled";
                }
            }

            // var bookActionButtons =
            //     (
            //         <div className="fixed-action-btn" style={{bottom: '45px', right:'24px'}}>
            //             {renewCheckbox}
            //             {returnButton}
            //             {instantCheckout}
            //             {recommendButton}
            //             {waitlistButton}
            //             {purchaseButton}
            //             {downloadButton}
            //             {addToCart}
            //         </div>
            //     );

            var likeStyle = {
                color: 'red',
                fontSize : '30px',
                margin: '10px'
            };

            var iconStyle = {
                fontSize : '30px',
                margin: '10px'
            };

            var sampleButton = null;
            var editButton = null;
            if(this.props.book.samplePath) {
                sampleButton = <li><a href={this.props.book.samplePath} target="_blank">Sample</a></li>
            }
            if(window.currentUser && window.currentUser.userType == "admin") {
                editButton = <li><a href="#editBookModal" className="modal-trigger editModalTrigger">Edit</a></li>
            }

            return (
                <div id="bookInfo">
                        <h2> {this.props.book.title} </h2>
                        <h5>by {authorText}</h5>
                            <p>{this.props.book.checkedOutOn}</p>
                            <div className="row">
                            <a><span style={likeStyle} onClick={this.toggleFavorite} className=""/></a>
                        {this.props.book.favorited ? <a><span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like-filled"/></a> : <span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like"/> }
                            <a href="#modalShare" className="modal-trigger shareModalTrigger "><i style={iconStyle} className="material-icons">share</i></a>
                        {!this.props.loggedIn ? null : this.isWishlisted() ? <a><i onClick={this.toggleWishlist} className="material-icons">playlist_add_check</i></a> :
                            <a><i onClick={this.toggleWishlist} className="material-icons">playlist_add</i></a>}
                        {card}
                    </div>
                    <a className="dropdown-button btn" id="actionsDropdown" data-activates='actionsDropdownList'>Actions</a>
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
                    <ul id='actionsDropdownList' className='dropdown-content'>
                        {renewCheckbox}
                        {returnButton}
                        {instantCheckout}
                        {recommendButton}
                        {waitlistButton}
                        {purchaseButton}
                        {downloadButton}
                        {sampleButton}
                        {addToCart}
                        {editButton}
                    </ul>
                </div>
            )
        }
    });
})