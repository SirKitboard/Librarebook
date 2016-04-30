define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'jsx!components/bookprofile/bookextras',
    'jsx!components/template/editbookmodal',
    'jsx!components/bookprofile/sharebookmodal',
    'actions/books'
], function(_,React, BookInfoComponent, BookExtrasComponent, BookEditModal, ShareBookModal, BookActions) {
    return React.createClass({
        getInitialState: function() {
            var loggedIn = false;
            if(window.currentUser)
            {
                loggedIn = true;
            }
            return {
                "book": null,
                loggedIn: loggedIn,
                editing : false,
                loading: true
            }
        },
        componentWillMount: function () {
            var bookID = this.props.view.split("/")[2];
            var book = this.props.stores.books.getBookOrPull(bookID);
            if(book) {
                this.setState({
                    book: book,
                    loading: false
                })
            } else {
                this.setState({
                    loading: true
                })
            }
        },
        componentWillUpdate: function (nextProps, nextState) {
            if(this.state.book == null) {
                var bookID = this.props.view.split("/")[2];
                var nextBook = nextProps.stores.books.getBook(bookID);
                if(nextBook){
                    nextState.book = nextBook;
                    nextState.loading = false;
                }
            }
        },
        rate: function() {
            var radioId = $('input[name=rating]:checked', '#ratingForm').attr("id");
            var rating = $("label[for=" + radioId + "]","#ratingForm").text();
            console.log(rating);
            BookActions.rate(this.state.book.id, rating);
        },
        render: function() {
            if (this.state.loading) {
                return (
                    <p>Loading</p>
                )
            }
            
            return (
                <div className="padNav" id="profileContent">
                    <div className="row" id="bookProfileTop">
                        <div className="col l4">
                            <BookInfoComponent book={this.state.book} loggedIn={this.state.loggedIn}/>
                        </div>
                        <div className="col l8">
                            <BookExtrasComponent book={this.state.book} id="bookExtras"/>
                        </div>
                    </div>
                    <div id="modalEditBook" className="modal">
                        <div className="modal-content container editBook">
                            <BookEditModal book={this.state.book}/>
                        </div>
                    </div>
                    <div id="modalShare" className="modal">
                        <div className="modal-content container shareBook">
                            <ShareBookModal loggedIn={this.state.loggedIn} book={this.state.book}/>
                        </div>
                    </div>
                    <div id="modalReview" className="modal">
                        <div className="modal-content reviewBook">
                            <div className="rating row">
                                <form action="#" id="ratingForm">
                                    <span>
                                        <input name="rating" type="radio" id="star1" />
                                        <label htmlFor="star1">1</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star2" />
                                        <label htmlFor="star2">2</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star3" />
                                        <label htmlFor="star3">3</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star4" />
                                        <label htmlFor="star4">4</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star5" />
                                        <label htmlFor="star5">5</label>
                                    </span>
                                </form>
                            </div>
                            <div classNames="row">
                                <div className="input-field col s12">
                                    <textarea id="textarea1" className="materialize-textarea"></textarea>
                                    <label htmlFor="textarea1">Review</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className= "modal-action modal-close waves-effect waves-green btn-flat" onClick={this.rate}>Submit</div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
