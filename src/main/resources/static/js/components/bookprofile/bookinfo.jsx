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
                        nextState.checkedOut = this.isCheckedOut(nextBook);
                    }
                }
            }
        },
        render: function() {
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

            var available = this.props.book.availableLicenses;
            if (available > 0) {
                var card =
                    (<div className="card green" id="bookAvailable">
                        <div className="card-content white-text">
                            <p className="center-align">Available</p>
                        </div>
                    </div>);
                var disabled = ""
            } else {
                var card =
                    (<div className="card red z-depth-1" id="bookAvailable">
                        <div className="card-content white-text">
                            <p className="center-align">Unavailable</p>
                        </div>
                    </div>);

                var disabled = "disabled"
            }

            var likeStyle = {
                color: 'red',
                fontSize : '30px',
            };

            var iconStyle = {
                fontSize : '30px',
            };

            if (this.state.checkedOut) {
                var returnOrCheckOut =
                    (<div className= "btn-large right bookButton" id="return" onClick={this.return}>Return</div>);
                console.log(returnOrCheckOut);
            } else {
                var returnOrCheckOut =
                    (<div className= "btn-large right bookButton" id="instantCheckout" onClick={this.checkout}>Checkout</div>);
            }

            return (
                <div id="bookInfo">
                    <h2> {this.props.book.title} </h2>

                    <h5>by {authorText}</h5>
                    <div className="row">
                        {this.props.book.favorited ? <span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like-filled"/> : <span style={likeStyle} onClick={this.toggleFavorite} className="icons8-like"/> }
                        {this.props.loggedIn ? <a href="#modalEditBook" style={iconStyle} className="modal-trigger editModalTrigger"><i style={iconStyle} className="material-icons">edit</i></a> : null}
                        {this.props.loggedIn ? <a href="#modalShare" className="modal-trigger shareModalTrigger "><i style={iconStyle} className="material-icons">share</i></a> : null}
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
                        <div className= {"btn-large right" + disabled} id="addToCart">Add to cart</div>
                        { returnOrCheckOut }
                        <div className= {"btn-large right bookButton"} id="purchase" onClick={this.purchase}>Purchase</div>
                    </div>
                </div>
            )
        }
    });
})