define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'jsx!components/bookprofile/bookextras',
    'jsx!components/bookprofile/sharebookmodal',
    'jsx!components/widgets/adContainer',
    'actions/books',
    'actions/authors',
    'actions/publishers'
], function(_,React, BookInfoComponent, BookExtrasComponent, ShareBookModal, AdComponent, BookActions, AuthorActions, PublisherActions) {
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
                loading: true,
                authors: [],
                selectedAuthors: [],
                selectedAuthorIDs: [],
                publishers: [],
                selectedPublisher: null
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
                var publisherID = e.target.getAttribute("data-id");
                var publisher = _.find(this.state.publishers, function(publisher) {
                    return (publisher.id+"") == publisherID;
                });
                publishers = publisherl
                this.setState({
                    selectedPublisherID: publisherIDs,
                    selectedPublisher: publishers,

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
        componentWillMount: function () {
            var bookID = this.props.view.split("/")[2];
            var book = this.props.stores.books.getBookOrPull(bookID);
            var recommended = this.props.stores.books.getRecommendedOrPull(bookID);
            if(book) {
                book: book,
                    this.setState({
                        book: book,
                        selectedAuthors: book.authors,
                        selectedAuthorIDs: _.pluck(book.authors, 'id'),
                        selectedPublisher: book.publisher,
                        loadingBook: false
                    });
            } else {
                this.setState({
                    loadingBook: true
                })
            }
            if (recommended) {
                this.setState({
                    recommended: recommended,
                    loadingRecommended: false
                })
            } else {
                this.setState({
                    loadingRecommended: true
                })
            }
        },
        componentWillUpdate: function (nextProps, nextState) {
            var bookID = this.props.view.split("/")[2];
            if(this.state.book == null) {
                var nextBook = nextProps.stores.books.getBook(bookID);
                if(nextBook){
                    nextState.book = nextBook;
                    nextState.selectedAuthors =  nextBook.authors;
                    nextState.selectedAuthorIDs = _.pluck(nextBook.authors, 'id');
                    nextState.selectedPublisher = nextBook.publisher
                    nextState.loadingBook = false;
                }
            }
            if(this.state.recommended == null && this.state.book != null) {
                var nextRecommended = nextProps.stores.books.getRecommended(bookID);
                if (nextRecommended) {
                    nextState.recommended = nextRecommended;
                    nextState.loadingRecommended = false;
                }
            }
        },
        rate: function() {
            var radioId = $('input[name=rating]:checked', '#ratingForm').attr("id");
            var rating = $("label[for=" + radioId + "]","#ratingForm").text();
            BookActions.rate(this.state.book.id, rating);
        },
        editBook : function() {
            var title = $("#title").val();
            var description = $("#description").val();
            var genre = $("#genreSelect").val();
            var author = this.state.selectedAuthorIDs;
            var maturity = $("#maturitySelect").val();
            var publisher = this.state.selectedPublisher.id;
            var yearPublished = $("#yearPublished").val();
            var totalLicenses = $("#totalLicenses").val();
            var language = $("#language").val();
            var numPages = $("#numPages").val();
            var status = (this.refs.bannedCheckbox.checked ? "Banned" : "Available");
            
            var data = {
                title: title,
                genres: genre,
                authors: author,
                maturity: maturity,
                publisher: publisher,
                description: description,
                yearPublished: yearPublished,
                totalLicenses: totalLicenses,
                language: language,
                numPages: numPages,
                status: status,
            };

            BookActions.editBook(data, this.state.book.id, this.updateBook);
        },
        updateBook: function(book) {
            console.log(this.state.book)
            this.setState({
                book: book,
                selectedAuthors: book.authors,
                selectedAuthorIDs: _.pluck(book.authors, 'id'),
                selectedPublisher: book.publisher,
                loadingBook: false
            })
        },
        componentDidUpdate: function() {
            $('select').material_select('destroy');
            $('select').material_select();
        },
        render: function() {
            if (this.state.loadingBook || this.state.loadingRecommended) {
                return (
                    <p>Loading</p>
                )
            }

            var ratings = this.state.book.ratings;
            if (ratings.length > 0 && this.state.loggedIn) {
                var itemRating = _.find(ratings, function(rating) {return rating.user === window.currentUser.id;});
                if (itemRating) {
                    var rating = itemRating.rating;
                }
            }
            var self = this;
            return (
                <div className="padNav" id="profileContent">
                    <div className="row" id="bookProfileTop">
                        <div className="col m12 l4">
                            <BookInfoComponent publisher={this.state.selectedPublisher} authors={this.state.selectedAuthors} book={this.state.book} loggedIn={this.state.loggedIn}/>
                        </div>
                        <div className="col m12 l6">
                            <BookExtrasComponent book={this.state.book} loggedIn={this.state.loggedIn} recommended={this.state.recommended} id="bookExtras"/>
                        </div>
                        <div className="col m5 l2">
                            <AdComponent orientation="vertical"/>
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
                                        <input name="rating" type="radio" id="star1" defaultChecked={rating === 1 ? "true" : ""}/>
                                        <label htmlFor="star1">1</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star2" defaultChecked={rating === 2 ? "true" : ""}/>
                                        <label htmlFor="star2">2</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star3" defaultChecked={rating === 3 ? "true" : ""}/>
                                        <label htmlFor="star3">3</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star4" defaultChecked={rating === 4 ? "true" : ""}/>
                                        <label htmlFor="star4">4</label>
                                    </span>
                                    <span>
                                        <input name="rating" type="radio" id="star5" defaultChecked={rating === 5 ? "true" : ""}/>
                                        <label htmlFor="star5">5</label>
                                    </span>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.rate}>Submit</div>
                            <div className="modal-action modal-close waves-effect waves-red btn-flat">Cancel</div>
                        </div>
                    </div>
                    <div id="editBookModal" style={{width:'600px'}}className="modal">
                        <div className="modal-content">
                            <div className="tabs-manager">
                                <div id="mainTab" className="tabcontent">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input placeholder="" ref="title" id="title" type="text" className="validate" defaultValue={this.state.book.title}/>
                                            <label className="active" htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m6 center-align">
                                            <select size="4" style={{overflowY: 'scroll'}} id="genreSelect" ref="genreSelect"  multiple>
                                                <option defaultValue="" disabled>Genres</option>
                                                {
                                                    _.map(this.props.stores.genres.getAll(), function(genre) {
                                                        // var id = "genre_" + genre.name;
                                                        var checked = false;
                                                        _.each(self.state.book.genres, function(ganre) {
                                                            if(genre.id == ganre.id) {
                                                                checked = true;
                                                            }
                                                        })
                                                        return <option checked={checked} defaultValue={genre.id}>{genre.name}</option>
                                                    })
                                                }
                                            </select>
                                            <label>Genres</label>
                                        </div>
                                        <div className="col s12 m6 center-align">
                                            <input type="checkbox" ref="bannedCheckbox" id="bannedCheckbox" defaultChecked={this.state.book.status == "Banned"}/>
                                            <label htmlFor="bannedCheckbox">Banned</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m6">
                                            <input placeholder="" onClick={this.slideToAuthorTab} ref="author" id="author" type="text" className="active validate" length="20" defaultValue={_.pluck(self.state.selectedAuthors, "firstName").join(",")}/>
                                            <label className="active" htmlFor="author">Author</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input onClick={this.slideToPublisherTab} ref="publisher" id="publisher" type="text" className="active validate" length="20" defaultValue={self.state.selectedPublisher ? self.state.selectedPublisher.name : ""}/>
                                            <label className="active" placeholder="" htmlFor="publisher">Publisher</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea placeholder="" id="description" ref="description" defaultValue={this.state.book.description} className="materialize-textarea"/>
                                            <label className="active" htmlFor="description">Description</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input placeholder="" id="yearPublished" ref="yearPublished"  className="validate" type="number" min="0" defaultValue={this.state.book.yearPublished}/>
                                            <label className="active"  htmlFor="yearPublished">Year Published</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label htmlFor="maturitySelect">Maturity Rating</label>
                                        <div className="input-field col s12">
                                            <select id="maturitySelect">
                                                <option disabled value="">Choose your option</option>
                                                <option selected={this.state.book.maturity == 0} value="0">Kids</option>
                                                <option selected={this.state.book.maturity == 1} value="1">Young Adults</option>
                                                <option selected={this.state.book.maturity == 2} value="2">Adults</option>
                                            </select>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input placeholder="" id="totalLicenses" ref="totalLicenses"  className="validate" type="number" min="0" defaultValue={this.state.book.totalLicenses}/>
                                            <label className="active" htmlFor="totalLicenenses">Total Licenses </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input placeholder="" id="language" ref="language" className="validate" type="text" defaultValue={this.state.book.language}/>
                                            <label className="active" htmlFor="language">Language</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input placeholder="" id="numPages" ref="numPages" className="validate" type="number" min="0" defaultValue={this.state.book.numPages}/>
                                            <label className="active" htmlFor="numPages">Number Of Pages</label>
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
                                        <button onClick={this.editBook} className="btn waves-effect waves-light modal-close" id='login' type="submit" name="action">Submit
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
                                                    if(publisher.id == self.state.selectedPublisher.id) {
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

// <div className="fixed-action-btn" style="bottom: 45px; right: 24px;">
//     <a className="btn-floating btn-large red">
//     <i className="large material-icons">mode_edit</i>
//     </a>
//     <ul>
//     <li><a className="btn-floating red"><i className="material-icons">insert_chart</i></a></li>
//     <li><a className="btn-floating yellow darken-1"><i className="material-icons">format_quote</i></a></li>
//     <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
//     <li><a className="btn-floating blue"><i className="material-icons">attach_file</i></a></li>
//     </ul>
//     </div>
