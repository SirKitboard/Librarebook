define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',

], function(_,React, BookInfoComponent) {
    return React.createClass({
        getInitialState: function() {
            return {
                "book": {
                    "title": "",
                    "author": "",
                    "isbn": 12345678910,
                    "available": true,
                    "year": 1994,
                    "publisher": "John Doe"
                }
            }
        },

        componentDidMount: function() {
            var self = this;
            $.ajax({
                url:"/api/items/books/"+window.bookID,
                method:"GET",
                success:function(response) {
                    self.setState({
                        'book' : response
                    });
                }
            })
        },

        saveChanges: function(){
            $.ajax({
                url: "/api/items/books/"+this.props.book.id+"/update",
                method: "PUT",
                success: function(response) {
                    self.setState({
                        isModalOpen : false
                    })
                }
            })
        },

        render: function() {
            return (
                <div id="modalEditBook" className="modal">
                    <div className="modal-content container editBook">
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
                                    <div class="input-field col s12">
                                        <select multiple ref="genres" id="genres">
                                            <option value="" disabled selected>Choose your option</option>
                                            <option value="genre_fiction">Fiction</option>
                                            <option value="genre_nonfiction">Non-Fiction</option>
                                            <option value="genre_youngadult">Young Adult</option>
                                            <option value="genre_biography">Biography</option>
                                            <option value="genre_sci-fi">Sci-Fi</option>
                                            <option value="genre_mystery">Mystery</option>
                                            <option value="genre_romance">Romance</option>
                                        </select>
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
                                    <textarea ref="description" id="description" type="text" class="materialize-textarea"
                                              className="validate"/>
                                        <label htmlFor="description">Description</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input ref="yearPublished" type="number" id="yearPushed" class="validate"/>
                                        <label htmlFor="yearPublished">yearPublished</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input ref="totalLicenses" id="totalLicenses" type="number" className="validate"/>
                                        <label htmlFor="totalLicenses">totalLicenses</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input ref="language" id="language" type="text" className="validate"/>
                                        <label htmlFor="language">Language</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input ref="itemStatus" id="itemStatus" type="text" className="validate"/>
                                        <label htmlFor="itemStatus">Item Status</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input ref='numPages' id="numPages" type="number" className="validate"/>
                                        <label htmlFor="zipCode">ZipCode</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <button onClick={this.saveChanges()} className="btn waves-effect waves-light" id='editChanges' type="submit" name="action">Edit
                                        <i className="material-icons right">send</i>
                                    </button>
                                    <button className="btn waves-effect waves-light modal-action modal-close">Close
                                        <i className="material-icons right">clear</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            )
        }
    });
});