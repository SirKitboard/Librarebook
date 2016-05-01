define([
    'underscore',
    'react',
    'jsx!components/template/book',
    'jsx!components/bookprofile/bookinfo',
    'actions/books',
    'actions/authors'
], function(_,React, Book, BookInfo, BookActions, AuthorActions) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
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
                selectedBook: 0,
                authors: [],
                selectedAuthors: [],
                selectedAuthorIDs: []
            }
        },
        
        addBook : function() {
            var title = $("#title").val();
            var description = $("#description").val();

            var genre = $("#genre").val();
            var publisher = $("#publisher").val();
            var yearPublished = $("#yearPublished").val();
            var totalLicenses = $("#totalLicenses").val();
            var language = $("#language").val();
            var numPages = $("#numPages").val();

            var data = {
                title: title,
                genres: genre,
                authors: author,
                publisher: publisher,
                description: description,
                yearPublished: yearPublished,
                totalLicenses: totalLicenses,
                language: language,
                numPages: numPages
            };

            BookActions.addBook(data);
        },

        componentDidMount: function() {
            $('.modal-trigger').leanModal();
            this.props.stores.authors.addChangeListener(this.authorsUpdated);
        },
        authorsUpdated:  function() {
            this.forceUpdate();
        },
        slidetoMainTab: function() {
            $("#mainTab").animate({
                left: '0px'
            });
            $("#authorTab").animate({
                left: '550px'
            });
            $("#publisherTab").animate({
                left: '1100px'
            });

        },
        slideToAuthorTab : function() {
            $("#mainTab").animate({
                left: '-550px'
            });
            $("#authorTab").animate({
                left: '0px'
            });
            $("#publisherTab").animate({
                left: '550px'
            });

        },
        slideToPublisherTab : function() {
            $("#mainTab").animate({
                left: '-1100px'
            });
            $("#authorTab").animate({
                left: '-550px'
            });
            $("#publisherTab").animate({
                left: '0px'
            });
        },
        submitSearch : function(e) {
            if (e.target.value.length ==0) {
                this.setState({
                    authors: []
                })
            }
            else {
                AuthorActions.pull(e.target.value, 0, this.setAuthors)
            }
        },
        setAuthors: function(authors) {
            this.setState({
                authors: authors
            })
        },
        authorClicked: function(e) {
            if(e.target.checked) {
                var authorIDs = this.state.selectedAuthorIDs;
                var authors = this.state.selectedAuthors;
                var authorID = e.target.getAttribute("data-id");
                authorIDs.push(authorID);
                var author = _.find(this.state.authors, function(author) {
                    return (author.id+"") == authorID;
                })
                authors.push(author);
                this.setState({
                    selectedAuthorIDs: authorIDs,
                    selectedAuthors: authors,

                })
            } else {
                var authorIDs = this.state.selectedAuthorIDs;
                var authors = this.state.selectedAuthors;
                var index = authors.indexOf(e.target.getAttribute("data-id"));
                authors.splice(index, 1);
                authorIDs.splice(index, 1);
                this.setState({
                    selectedAuthors: authors,
                    selectedAuthorIDs: authorIDs
                })
            }
        },
        render: function() {
            var self = this;

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
                        <div className="modal-content">
                            <div className="tabs-manager">
                                <div id="mainTab" className="tabcontent">
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input ref="title" id="title" type="text" className="validate" length="20"/>
                                             <label htmlFor="title">Title</label>
                                         </div>
                                         <div className="input-field col s12 m6">
                                             <input ref="genre" id="genre" type="text" className="validate"/>
                                             <label htmlFor="genre">Genre</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12 m6">
                                             <input onClick={this.slideToAuthorTab} ref="author" id="author" type="text" className="active validate" length="20" value={_.pluck(self.state.selectedAuthors, "firstName").join(",")}/>
                                             <label className="active" htmlFor="author">Author</label>
                                         </div>
                                         <div className="input-field col s12 m6">
                                             <input onClick={this.slideToPublisherTab}ref="publisher" id="publisher" type="text" className="validate"/>
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
                                         <div className="input-field col s12">
                                             <textarea id="yearPublished" ref="yearPublished" className="materialize-textarea"></textarea>
                                             <label htmlFor="yearPublished">Year Published</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <textarea id="totalLicenses" ref="totalLicenses" className="materialize-textarea"></textarea>
                                             <label htmlFor="totalLicenenses">Total Licenses </label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <textarea id="language" ref="language" className="materialize-textarea"></textarea>
                                             <label htmlFor="language">Language</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <textarea id="numPages" ref="numPages" className="materialize-textarea"></textarea>
                                             <label htmlFor="numPages">Number Of Pages</label>
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
                                         <button onClick={this.addBook} className="btn waves-effect waves-light modal-close" id='login' type="submit" name="action">Submit
                                             <i className="material-icons right">send</i>
                                         </button>
                                     </div>
                                </div>
                                <div id="authorTab" className="tabcontent">
                                     <h3>Author</h3>
                                     <p>Pick an author.</p>
                                      <div className="input-field">
                                          <input id="searchForModal" type="search" placeholder="Search" autoComplete="off" onChange={this.submitSearch} required/>
                                          <label htmlFor="searchForModal">Search</label>
                                      </div>
                                      <div id="authorList">
                                          <ul>
                                              {
                                                  _.map(this.state.authors, function(author) {
                                                      var id = author.id;
                                                      var selected = false;
                                                      if(self.state.selectedAuthorIDs.indexOf(author.id+"") >=0) {
                                                          selected = true;
                                                      }

                                                      return (
                                                          <li>
                                                              <input checked={selected} data-id={author.id} onChange={self.authorClicked} type="checkbox" id={id} />
                                                              <label htmlFor={id}>{author.firstName} {author.lastName}</label>
                                                          </li>
                                                      )
                                                  })

                                              }
                                          </ul>
                                      </div>

                                     <a onClick={this.slidetoMainTab}  className="waves-effect waves-light btn">done</a>
                                </div>
                                <div id="publisherTab" className="tabcontent">
                                    <h3>Publisher</h3>
                                    <div className="input-field">
                                        <div className="search-wrapper card">
                                            <input id="search"></input>
                                            <i className="material-icons">search</i>
                                            <div className="search-results"></div>
                                        </div>
                                        <a onClick={this.slidetoMainTab}  className="waves-effect waves-light btn">done</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
