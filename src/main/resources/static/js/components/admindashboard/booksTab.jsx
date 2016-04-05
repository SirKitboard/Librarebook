define([
    'underscore',
    'react',
    'jsx!components/template/book',
    'jsx!components/bookprofile/bookinfo'
], function(_,React, Book, BookInfo) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            var book = {
                "title": "Hello World",
                "author": "John Smith",
                "isbn": 12345678910,
                "available": "Available",
                "year": 1994,
                "publisher": "John Doe"
            }
            return {
                books : [book, book, book, book, book, book, book],
                selectedBook: 0
            }
        },
        componentDidMount: function() {
            $('.modal-trigger').leanModal();
        },
        render: function() {
            return (

                <div id="booksTab" className="row">
                    <div className="col s12 m3 bookList">
                        <div className="input-field">
                          <i className="material-icons prefix">search</i>
                          <input id="search" type="text" className="validate"/>
                          <label htmlFor="search">Search</label>
                        </div>
                        <ul>
                            {
                                _.map(this.state.books, function(book) {
                                    return (
                                        <li>
                                            <Book book={book}/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="col s12 m9 BookDetails">
                        <BookInfo book={this.state.books[0]}/>
                    </div>
                    <div className="fixed-action-btn">
                       <a className="btn-floating btn-large red modal-trigger" href="#addBookModal">
                         <i className="large material-icons">add</i>
                       </a>
                     </div>
                     <div id="addBookModal" className="modal">
                         <div className="modal-content container">
                             <div className="row">
                                 <div className="input-field col s12">
                                     <input ref="name" id="name" type="text" className="validate" length="20"/>
                                     <label htmlFor="name">Name</label>
                                 </div>
                             </div>
                             <div className="row">
                                 <div className="input-field col s12 m6">
                                     <input ref="author" id="author" type="text" className="validate" length="20"/>
                                     <label htmlFor="author">Author</label>
                                 </div>
                                 <div className="input-field col s12 m6">
                                     <input ref="publisher" id="publisher" type="text" className="validate"/>
                                     <label htmlFor="publisher">Publisher</label>
                                 </div>
                             </div>
                             <div className="row">
                                 <div className="input-field col s12">
                                   <textarea id="description" ref="description" className="materialize-textarea"></textarea>
                                   <label htmlFor="description">Description</label>
                                 </div>
                             </div>
                             <div className="row">
                                 <div className="file-field input-field">
                                   <div className="btn">
                                     <span>PDF</span>
                                     <input onChange={this.handleFile} ref="files" type="file" accept="application/pdf"/>
                                   </div>
                                   <div className="file-path-wrapper">
                                     <input className="file-path validate" type="text" placeholder="Upload book pdf" />
                                   </div>
                                 </div>
                             </div>
                             <div className="row">
                             <button onClick={this.handleSubmit} className="btn waves-effect waves-light modal-close" id='login' type="submit" name="action">Submit
                                 <i className="material-icons right">send</i>
                             </button>
                             </div>
                         </div>
                     </div>
                </div>
            )
        }
    });
})
