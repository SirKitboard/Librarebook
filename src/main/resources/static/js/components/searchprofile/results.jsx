define([
    'underscore',
    'react',
    'jsx!components/widgets/book'
], function(_, React, Book) {
    return React.createClass({
        render: function() {
            var self = this;
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
    });
});
