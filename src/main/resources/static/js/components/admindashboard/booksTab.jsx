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
            var book = {
                "title": "Hello World",
                "author": "John Smith",
                "isbn": 12345678910,
                "available": "Available",
                "year": 1994,
                "publisher": "John Doe"
            }
            BookActions.getUserRecommended();

            return {
                books : [book, book, book, book, book, book, book],
                selectedBook: 0,
                authors: [],
                selectedAuthors: [],
                selectedAuthorIDs: [],
                publishers: [],
                selectedPublishers: null,
                selectedPublisherIDs: null
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
            $('.modal-trigger.addBookModal').leanModal();
            $('select').material_select();
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

                <div id="booksTab" className="container row">
                    <ul className="collection with-header">
                        <li className="collection-header"><h4>Need more stock</h4></li>
                        {
                            _.map(this.props.stores.books.getUserRecommended().existing, function(item) {
                                var book = self.props.stores.books.getBookOrPull(item.item);
                                if(!book) {
                                    return null;
                                }
                                var imageURL = "http://placehold.it/100x1000";
                                if(book.coverImageUrl && book.coverImageUrl.length > 0) {
                                    imageURL = book.coverImageUrl;
                                }
                                return (
                                    <li className="collection-item avatar">
                                        <img src={imageURL} alt="" className="circle"/>
                                        <span className="title">{book.title}</span>
                                        <p>
                                            {
                                                _.pluck(book.authors, 'name').join("<br/>")
                                            }
                                        </p>
                                        <a onClick={self.approveRecommnedation} data-id={item.id} className="secondary-content green-text"><i className="material-icons">check</i></a>
                                        <a onClick={self.rejectRecommendation} data-id={item.id} style={{top: '45px'}}className="secondary-content red-text"><i className="material-icons">close</i></a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className="collection with-header">
                        <li className="collection-header"><h4>Not in Library</h4></li>
                        {
                            _.map(this.props.stores.books.getUserRecommended().newBooks, function(item) {
                                return (
                                    <li className="collection-item">
                                        {item.bookName} by {item.authorName}
                                        <a onClick={self.approveRecommnedation} data-id={item.id} className="secondary-content green-text"><i data-id={item.id} className="material-icons">check</i></a>
                                        <a onClick={self.rejectRecommendation} data-id={item.id} style={{right: '45px'}}className="secondary-content red-text"><i data-id={item.id} className="material-icons">close</i></a>
                                    </li>
                                )
                            })
                        }
                    </ul>
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
