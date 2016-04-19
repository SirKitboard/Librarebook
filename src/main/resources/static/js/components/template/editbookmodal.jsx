define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'actions/books',

], function (_, React, BookInfoComponent, BookActions) {
    return React.createClass({
        getInitialState: function() {
            return {
                "book": this.props.book
            }
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                book: nextProps.book
            })
        },
        componentDidMount: function() {
            this.setState({
                book: this.props.book
            })
        },

        saveChanges: function() {
            var self = this;
            var book = this.props.book;
            BookActions.update(book.id)
        },

        render: function() {
            return (
                <div className="row">
                    <div id="editBook" className="col s12 editBookCol">
                        <div className="row contact header">
                            <span>Edit Information</span>
                            <i className="material-icons">info_outline</i>
                        </div>
                        <div className="row">
                            <div className="input-field col s12 m6">
                                <input ref="title" id="title" type="text" className="validate"/>
                                <label htmlFor="title">Title</label>
                            </div>
                            <div className="input-field col s12">
                                <div className="col s12 m6 genre-filters input-field">
                                    <p>
                                        <input type="checkbox" id="genre_fiction"/>
                                        <label htmlFor="genre_fiction">Fiction</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_nonfiction"/>
                                        <label htmlFor="genre_nonfiction">Nonfiction</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_youngadult"/>
                                        <label htmlFor="genre_youngadult">Young Adult</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_mature"/>
                                        <label htmlFor="genre_mature">Mature</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_biography"/>
                                        <label htmlFor="genre_biography">Biography</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_sci-fi"/>
                                        <label htmlFor="genre_sci-fi">Science Fiction</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_mystery"/>
                                        <label htmlFor="genre_mystery">Mystery</label>
                                    </p>
                                    <p>
                                        <input type="checkbox" id="genre_romance"/>
                                        <label htmlFor="genre_romance">Romance</label>
                                    </p>
                                </div>
                                <label htmlFor="genres">Genres</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="author" id="author" type="text" className="validate"/>
                            <label htmlFor="author">Author</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="publisher" id="publisher" type="text" className="validate"/>
                            <label htmlFor="publisher">Publisher</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                                    <textarea ref="description" id="description" type="text"
                                              className="materialize-textarea"/>
                            <label htmlFor="description">Description</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input ref="yearPublished" type="number" id="yearPushed" className="validate"/>
                            <label htmlFor="yearPublished">Year Published</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="totalLicenses" id="totalLicenses" type="number" className="validate"/>
                            <label htmlFor="totalLicenses">Total Licenses</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <div className="col s12 m6 language-filters input-field">
                                <p>
                                    <input type="checkbox" id="language_english"/>
                                    <label htmlFor="language_english">English</label>
                                </p>
                                <p>
                                    <input type="checkbox" id="language_french"/>
                                    <label htmlFor="language_french">French</label>
                                </p>
                                <p>
                                    <input type="checkbox" id="language_spanish"/>
                                    <label htmlFor="language_spanish">Spanish</label>
                                </p>
                            </div>
                            <label htmlFor="language">Language</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <div className="col s12 m6 itemStatus-filters input-field">
                                <p>
                                    <input id="itemStatus_available" type="radio" name="itemStatus"/>
                                    <label htmlFor="itemStatus_available">Available</label>
                                </p>
                                <p>
                                    <input id="itemStatus_unavailable" type="radio" name="itemStatus"/>
                                    <label htmlFor="itemStatus_unavailable">Unavailable</label>
                                </p>
                                <p>
                                    <input id="itemStatus_unlisted" type="radio" name="itemStatus"/>
                                    <label htmlFor="itemStatus_unlisted">Unlisted</label>
                                </p>
                            </div>
                            <label htmlFor="itemStatus">Item Status</label>
                        </div>
                    </div>
                    <div className="row">
                        <button onClick={this.saveChanges} className="btn waves-effect waves-light"
                                id='editChanges' type="submit" name="action">Edit
                            <i className="material-icons right">send</i>
                        </button>
                        <button onClick={this.props.onClose}
                                className="btn waves-effect waves-light modal-action modal-close"
                                id="close" name="action">Close
                        </button>
                    </div>
                </div>
            )
        }
    });
});