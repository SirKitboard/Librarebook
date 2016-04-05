define([
    'underscore',
    'react',
    'jsx!components/widgets/bookCarousel'
], function(_, React, BookCarouselComponent) {
    return React.createClass({
        getInitialState: function() {
            var book = {
                title: null,
                description: null,
                author: null
            };
            var books = []
            for (i=0; i<10; i++) {
                books.push(book);
            }
            return {
                "recommendations": books
            }
        },

        render: function() {
            return (
                <div className="recommendContainer">
                    <div>
                        <h5>Similar Books</h5>
                    </div>
                    <div className="bookRecommend">
                        <BookCarouselComponent books={this.state.recommendations} />
                    </div>
                </div>
            )
        }
    });
})
