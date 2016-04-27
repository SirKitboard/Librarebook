define([
    'underscore',
    'react',
    'jsx!components/widgets/book'
], function(_, React, Book) {
    return React.createClass({
        componentDidMount: function () {
            if(this.props.display == "list") {
                $('.collapsible').collapsible({
                    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });
            }
        },
        componentDidUpdate: function(prevProps, prevState) {
            if(this.props.display == "list" && prevProps.display != "list") {
                $('.collapsible').collapsible({
                    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });
            }
        },
        gotoBook : function(e) {
            this.props.setView("view/bookProfile/"+e.target.getAttribute('data-id'));
        },
        render: function() {
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
                    </div>
                )
            }
            else {
                return (
                    <div style={{width:'90%', margin:'auto'}}>
                        <ul className="collapsible popout" data-collapsible="accordion">
                            {
                                _.map(this.props.books, function(book) {
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
            }
        }
    });
});
