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
        componentWillMount: function() {
            BookActions.getUserRecommended();
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
            // console.log(this.props.stores.books.getUserRecommended().existing);
            return (

                <div id="recommendationsTab" className="container row">
                    <ul className="collection with-header">
                        <li className="collection-header"><h4>Need more stock</h4></li>
                        { Object.keys(this.props.stores.books.getUserRecommended().existing).length > 0 ?
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
                            }) : <li className="collection-item">None</li>
                        }
                    </ul>
                    <ul className="collection with-header">
                        <li className="collection-header"><h4>Not in Library</h4></li>
                        { Object.keys(this.props.stores.books.getUserRecommended().newBooks).length > 0 ?
                            _.map(this.props.stores.books.getUserRecommended().newBooks, function(item) {
                                return (
                                    <li className="collection-item">
                                        {item.bookName} by {item.authorName}
                                        <a onClick={self.approveRecommnedation} data-id={item.id} className="secondary-content green-text"><i data-id={item.id} className="material-icons">check</i></a>
                                        <a onClick={self.rejectRecommendation} data-id={item.id} style={{right: '45px'}}className="secondary-content red-text"><i data-id={item.id} className="material-icons">close</i></a>
                                    </li>
                                )
                            }) : <li className="collection-item">None</li>
                        }
                    </ul>
                </div>
            )
        }
    });
})
