define([
    'underscore',
    'react',
    'jsx!components/widgets/book'
], function(_, React, Book) {
    return React.createClass({
        getInitialState: function() {
            var pageCount = 20;
            var books = _.groupBy(this.props.books, function(book, index) {
                return Math.floor(index/pageCount);
            })
            books = _.toArray(books);
            return {
                currentPage: 1,
                books: books
            }
        },
        componentDidMount: function () {
            if(this.props.display == "list") {
                $('.collapsible').collapsible({
                    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });
            }
            var self = this;
            $(window).bind("scroll.page-manager", function(e) {
                var windowScrollHeight = $(this).scrollTop();
                var pages = $(".page").toArray();
                var currentMin = -999999;
                var pageNum = 0;
                for(var i = 0; i<pages.length; i++) {
                    var pageScroll = $(pages[i]).offset().top;
                    if(windowScrollHeight - pageScroll < 0 && windowScrollHeight - pageScroll > currentMin) {
                        currentMin = windowScrollHeight - pageScroll;
                        pageNum = i+1;
                    }
                }
                if(pageNum == 0) {
                    pageNum = self.state.books.length;
                }
                self.setState({
                    currentPage: pageNum
                })
                if(self.state.books.length - 2 < pageNum) {
                    self.props.fetchMoreBooks();
                }
            })
        },
        componentWillReceiveProps: function(nextProps) {
            var pageCount = 20;
            var books = _.groupBy(nextProps.books, function(book, index) {
                return Math.floor(index/pageCount);
            })
            books = _.toArray(books);
            this.setState({
                books: books
            })
        },
        componentWillUnmount: function() {
            $(window).unbind("scroll.page-manager");
        },
        componentDidUpdate: function(prevProps, prevState) {
            $('.collapsible').collapsible({
                accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });
        },
        gotoBook : function(e) {
            this.props.setView("view/bookProfile/"+e.target.getAttribute('data-id'));
        },
        prevPage: function() {
            if(this.state.currentPage == 0) {
                return;
            }
            var top = $("[data-pagenum='"+(this.state.currentPage-1)+"'").offset().top;
            $('html, body').animate({
                scrollTop: top-100
            }, 400);
        },
        nextPage: function() {
            if(this.state.currentPage == this.state.books.length) {
                return;
            }
            var top = $("[data-pagenum='"+(this.state.currentPage+1)+"'").offset().top;
            $('html, body').animate({
                scrollTop: top-100
            }, 400);
        },
        firstPage: function() {
            $('html, body').animate({
                scrollTop: 0
            }, 400);
        },
        render: function() {
            var nextEnabled = true;
            var prevEnabled = true;
            var navClasses = "material-icons medium";
            var nextClassees = nextEnabled ? navClasses : navClasses + " disabled";
            var prevClassees = prevEnabled ? navClasses : navClasses + " disabled";
            var self = this;
            if(this.props.display == "grid") {
                return (
                    <div>
                        {
                            _.map(this.props.books, function(book) {
                                return (
                                    <div style={{display:'inline-block'}}>
                                        <Book setView={self.props.setView} book={book}/>
                                    </div>
                                )
                            })
                        }
                        <div className="page-manager">
                            <i className={prevClassees}>skip_previous</i>
                            <i className={prevClassees}>navigate_before</i>
                            <span className="page-number">{this.state.currentPage}</span>
                            <i className={nextClassees}>navigate_next</i>
                            <i className={nextClassees}>skip_next</i>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div style={{width:'90%', margin:'auto'}}>
                        {
                            _.map(this.state.books, function (bookChunk, index) {
                                return (
                                    <div className="page">
                                        <div data-pagenum={index + 1} className="page-header">Page {index + 1}</div>
                                        <ul className="collapsible popout" data-collapsible="accordion">
                                            {
                                                _.map(bookChunk, function(book) {
                                                    var imageURL = "http://placehold.it/200x250";
                                                    if(book.coverImageUrl && book.coverImageUrl.length > 0) {
                                                        imageURL = book.coverImageUrl;
                                                    }
                                                    return (<li>
                                                        <div className="collapsible-header"><i className="material-icons">library_books</i>{book.title} by {book.authors[0].firstName} {book.authors[0].lastName}</div>
                                                        <div className="collapsible-body row" style={{textAlign:'left'}}>
                                                            <div className="col s12 m3">
                                                                <img style={{width:'100%', height:'auto'}} src={imageURL}/>
                                                            </div>
                                                            <div className="col s12 m9">
                                                                <h4>{book.title}</h4>
                                                                <table>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style={{width:'10px'}} rowSpan={book.authors.length}>By</td>
                                                                        <td className="bold">{book.authors[0].firstName} {book.authors[0].lastName}</td>
                                                                    </tr>
                                                                    {
                                                                        _.map(book.authors.splice(1), function (author) {
                                                                            return (<tr>
                                                                                <td className="bold">
                                                                                    {author.firstName} {author.lastName}
                                                                                </td>
                                                                            </tr>)
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                                Publisher : <span className="bold">{book.publisher.name}</span>
                                                                <div className="flow-text">
                                                                    {book.description}
                                                                </div>
                                                                <a onClick={self.gotoBook} style={{float:'right', marginBottom:'15px', marginRight:'10px'}} data-id={book.id} className="btn waves-effect waves-light">
                                                                    View
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </li>)
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        <div className="page-manager">
                            <i onClick={this.firstPage} className={prevClassees}>skip_previous</i>
                            <i onClick={this.prevPage} className={prevClassees}>navigate_before</i>
                            <span className="page-number">{this.state.currentPage}</span>
                            <i onClick={this.nextPage} className={nextClassees}>navigate_next</i>
                            <i onClick={this.lastPage} className={nextClassees}>skip_next</i>
                        </div>
                    </div>
                )
            }
        }
    });
});
