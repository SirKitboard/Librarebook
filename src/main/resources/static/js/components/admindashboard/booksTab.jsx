define([
    'underscore',
    'react',
    'jsx!components/template/book',
    'jsx!components/bookprofile/bookinfo',
    'actions/books',
    'actions/authors',
    'actions/publishers'
], function(_,React, Book, BookInfo, BookActions, AuthorActions,PublisherActions) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            var self = this;
            if(this.props.stores.books.getBestSellers().length != 0) {
                var book = _.find(this.props.stores.books.getBestSellers(), function(book) {return book.id == 0});
                debugger;
                if(!book) {
                    var selectedBook = this.props.stores.books.getBestSellers()[0].id;
                    var selectedBookObject = this.props.stores.books.getBestSellers()[0];
                }
            }
            return {
                selectedBook: 0,
                authors: [],
                selectedAuthors: [],
                selectedAuthorIDs: [],
                publishers: [],
                selectedPublishers: selectedBook,
                selectedPublisherIDs: selectedBookObject
            }
        },
        addBook : function() {
            var title = $("#title").val();
            var description = $("#description").val();

            var genre = $("#genreSelect").val();
            var author = this.state.selectedAuthorIDs;
            var publisher = this.state.selectedPublisherIDs;
            var yearPublished = $("#yearPublished").val();
            var totalLicenses = $("#totalLicenses").val();
            var language = $("#language").val();
            var numPages = $("#numPages").val();
            var maturity = $("#maturitySelect").val();

            var data = {
                title: title,
                genres: genre,
                authors: author,
                publisher: publisher,
                description: description,
                yearPublished: yearPublished,
                totalLicenses: totalLicenses,
                language: language,
                numPages: numPages,
                maturity: maturity
            };

            BookActions.addBook(data);
        },
        setBook: function(e) {
            var target = e.target;
            while(!target.classList.contains("cart-book")) {
                target = target.parentNode;
            }
            var id = parseInt(target.getAttribute("data-id"));
            console.log(id);
            var book = _.find(this.props.stores.books.getBestSellers(), function(book){return book.id == id});
            console.log(book);
            this.setState({
                selectedBook: parseInt(id),
                selectedBookObject : book
            })
        },
        componentDidMount: function() {
            $('.modal-trigger.addBookModal').leanModal();
            $('select').material_select();
        },
        componentWillUpdate: function(nextProps, nextState) {
            var self = this;
            if(!nextState.selectedBookObject) {
                if (this.props.stores.books.getBestSellers().length != 0) {
                    var book = _.find(this.props.stores.books.getBestSellers(), function (book) {
                        return book.id == nextState.selectedBook
                    })
                    if (!book) {
                        nextState.selectedBook = this.props.stores.books.getBestSellers()[0].id;
                        nextState.selectedBookObject = this.props.stores.books.getBestSellers()[0];
                    }

                }
            }
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
        submitAuthorSearch : function(e) {
            if (e.target.value.length ==0) {
                this.setState({
                    authors: []
                })
            }
            else {
                AuthorActions.pull(e.target.value, 0, this.setAuthors)
            }
        },
        submitPublisherSearch : function(e){
            if (e.target.value.length ==0) {
                this.setState({
                    publishers: []
                })
            }
            else {
                PublisherActions.pull(e.target.value, 0, this.setPublishers)
            }
        },
        setPublishers: function(publishers){
            this.setState({
                publishers: publishers
            })
        },
        setAuthors: function(authors) {
            this.setState({
                authors: authors
            })
        },
        publisherClicked: function(e){
            if(e.target.checked) {
                var publisherIDs = this.state.selectedPublisherIDs;
                var publishers = this.state.selectedPublishers;
                var publisherID = e.target.getAttribute("data-id");
                publisherIDs = publisherID ;
                var publisher = _.find(this.state.publishers, function(publisher) {
                    return (publisher.id+"") == publisherID;
                });
                publishers = publisher
                this.setState({
                    selectedPublisherIDs: publisherIDs,
                    selectedPublishers: publishers,

                })
            } else {
                var publisherIDs = this.state.selectedPublisherIDs;
                var publishers = this.state.selectedPublishers;
                var index = publishers.indexOf(e.target.getAttribute("data-id"));
                publishers.splice(index, 1);
                publisherIDs.splice(index, 1);
                this.setState({
                    selectedPublishers: publishers,
                    selectedPublisherIDs: publisherIDs
                })
            }

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
        componentDidUpdate: function() {
            $('select').material_select('destroy');
            $('select').material_select();
            var self = this;
        },

        approveRecommnedation: function(e) {
            var target = e.target;
            if(target.tagName != "A") {
               target = target.parentNode;
            }
            var id = target.getAttribute("data-id");
            BookActions.approveRecommendation(id);
        },
        rejectRecommendation: function(e) {
            var target = e.target;
            if(target.tagName != "A") {
                target = target.parentNode;
            }
            var id = target.getAttribute("data-id");
            BookActions.rejectRecommendation(id);
        },
        render: function() {
            var self = this;
            return (

                <div id="booksTab" className="row">
                    <div className="col s12 m3 bookList">
                        <h4>Best Sellers</h4>
                        <div className="input-field">
                            <i className="material-icons prefix">search</i>
                            <input id="search" type="text" className="validate"/>
                            <label htmlFor="search">Search</label>
                        </div>
                        <ul>
                            {
                                _.map(this.props.stores.books.getBestSellers(), function (book) {
                                    return (
                                        <li>
                                            <Book setUser={self.setBook} id={book.id} book={book}/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="col s12 m9 BookDetails">
                        {this.state.selectedBookObject ? <BookInfo book={this.state.selectedBookObject}/> : null}
                    </div>
                    <div className="fixed-action-btn">
                        <a className="btn-floating btn-large red modal-trigger addBookModal" href="#addBookModal">
                            <i className="large material-icons">add</i>
                        </a>
                    </div>
                    <div id="addBookModal" style={{width:'600px'}}className="modal">
                        <div className="modal-content">
                            <div className="tabs-manager">
                                <div id="mainTab" className="tabcontent">
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input ref="title" id="title" type="text" className="validate"/>
                                             <label htmlFor="title">Title</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12 m6 center-align">
                                             <select size="4" style={{overflowY: 'scroll'}} id="genreSelect" ref="genreSelect"  multiple>
                                                 <option value="" disabled>Genres</option>
                                                 {
                                                     _.map(this.props.stores.genres.getAll(), function(genre) {
                                                         // var id = "genre_" + genre.name;
                                                         return <option value={genre.id}>{genre.name}</option>
                                                     })
                                                 }
                                             </select>
                                             <label>Genres</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12 m6">
                                             <input onClick={this.slideToAuthorTab} ref="author" id="author" type="text" className="active validate" length="20" value={_.pluck(self.state.selectedAuthors, "firstName").join(",")}/>
                                             <label className="active" htmlFor="author">Author</label>
                                         </div>
                                         <div className="input-field col s12 m6">
                                             <input onClick={this.slideToPublisherTab} ref="publisher" id="publisher" type="text" className="active validate" length="20" value={self.state.selectedPublishers ? self.state.selectedPublishers.name : ""}/>
                                             <label className="active" htmlFor="publisher">Publisher</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <textarea id="description" ref="description" className="materialize-textarea"/>
                                             <label htmlFor="description">Description</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input id="yearPublished" ref="yearPublished"  className="validate" type="number" min="0"/>
                                             <label htmlFor="yearPublished">Year Published</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input id="totalLicenses" ref="totalLicenses"  className="validate" type="number" min="0"/>
                                             <label htmlFor="totalLicenenses">Total Licenses </label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input id="language" ref="language" className="validate" type="text"/>
                                             <label htmlFor="language">Language</label>
                                         </div>
                                     </div>
                                     <div className="row">
                                         <div className="input-field col s12">
                                             <input id="numPages" ref="numPages" className="validate" type="number" min="0"/>
                                             <label htmlFor="numPages">Number Of Pages</label>
                                         </div>
                                     </div>
                                    <div className="row">
                                        <div className="input-field col s12 m6 center-align">
                                            <select id="maturitySelect">
                                                {/*I touched your code, muahahaha*/}
                                                <option value="">Choose an option</option>
                                                <option value="0">Kids</option>
                                                <option value="1">Young Adults</option>
                                                <option value="2">Adults</option>
                                            </select>
                                            <label htmlFor="maturitySelect">Maturity</label>
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
                                          <input id="searchForModal" type="search" autoComplete="off" onChange={this.submitAuthorSearch} required/>
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
                                        <input id="searchForModal" type="search" autoComplete="off" onChange={this.submitPublisherSearch} required/>
                                        <label htmlFor="searchForModal">Search</label>
                                    </div>
                                    <div id="publisherList">
                                        <ul>
                                            {
                                                _.map(this.state.publishers, function(publisher) {
                                                    var id = publisher.id;
                                                    var selected = false;
                                                    if(publisher.id == self.state.selectedPublisherIDs) {
                                                        selected = true;
                                                    }

                                                    return (
                                                        <li>
                                                            <input checked={selected} data-id={publisher.id} onChange={self.publisherClicked} type="checkbox" id={id} />
                                                            <label htmlFor={id}>{publisher.name}</label>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <a onClick={this.slidetoMainTab}  className="waves-effect waves-light btn">done</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
