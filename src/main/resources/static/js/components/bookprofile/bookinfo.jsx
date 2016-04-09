define([
    'underscore',
    'react'
], function(_, React) {
    return React.createClass({
        getInitialState: function(){
            var liked = false;
            var self = this;
            var loggedIn = false;
            if (window.currentUser) {
                loggedIn = true;
            }
            $.ajax({
                url: "/api/items/"+window.bookID+"/getfavorite",
                method: "POST",
                success: function (response) {
                    self.setState({
                        liked: response.favorited
                    })
                }
            });
            return {
                'liked': liked,
                'loggedIn' : loggedIn
            }
        },
        toggleLike : function() {
            var self = this;
            var book = this.props.book;
            $.ajax({
                url: "/api/items/"+this.props.book.id+"/favorite",
                method: "POST",
                success: function(response) {
                    self.setState({
                        liked : response.favorited
                    })
                }
            })
        },

        checkout: function() {
            
        },
        editModal : function() {
            var book = this.props.book;
            this.setState({ showModal : true});
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
                    </div>)
                var disabled = ""
            } else {
                var card =
                    (<div className="card red z-depth-1" id="bookAvailable">
                        <div className="card-content white-text">
                            <p className="center-align">Unavailable</p>
                        </div>
                    </div>)

                var disabled = "disabled"
            }

            var likeStyle = {
                color: 'red',
                fontSize : '30px'
            }

            var editStyle = {
                fontSize : '30px',
            }

            return (
                <div id="bookInfo">
                    <h2> {this.props.book.title} </h2>

                    <h5>by {authorText}</h5>
                    <div className="row">
                        {this.state.liked ? <span style={likeStyle} onClick={this.toggleLike} className="icons8-like-filled"/> : <span style={likeStyle} onClick={this.toggleLike} className="icons8-like"/> }
                        {card}
                        {this.props.loggedIn ? <a href="#modalEditBook" style={editStyle} className="modal-trigger modal-bookprofile icons8-edit-property" onClick={this.props.onEditClicked}/> : ""}
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
                    <button className= {"btn-large right " + disabled} id="addToCart">Add to cart</button>
                    <button className= {"btn-large right " + disabled} id="instantCheckout" onClick={this.checkout()}>Checkout</button>
                </div>
            )
        }
    });
})