define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'jsx!components/bookprofile/bookextras',
    'jsx!components/template/editbookmodal',
    'stores/books'
], function(_,React, BookInfoComponent, BookExtrasComponent, BookEditModal) {
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
        toggleEditModal : function() {
            if(this.state.editing) {
                $("#modalEditBook").closeModal();
            } else {
                $("#modalEditBook").openModal();
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
                            <BookInfoComponent book={this.state.book} onEditClick={this.toggleEditModal} loggedIn={this.state.loggedIn}/>
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
                </div>
            )
        }
    });
})
