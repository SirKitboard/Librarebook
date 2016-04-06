define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'jsx!components/bookprofile/bookextras',
    'jsx!components/bookprofile/bookrecommend'
], function(_,React, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            return {
                "book": {
                    "title": "",
                    "author": "",
                    "isbn": 12345678910,
                    "available": true,
                    "year": 1994,
                    "publisher": "John Doe"
                }
            }
        },
        componentDidMount: function () {
            var self = this;
            $.ajax({
                url:"/api/items/books/"+window.bookID,
                method:"GET",
                success : function(response) {
                    // debugger;
                    self.setState({
                        'book' : response
                    });
                    // debugger;
                }
            })
        },
        render: function() {
            return (
                <div id="profileContent">
                    <div className="row" id="bookProfileTop">
                        <div className="col l4">
                            <BookInfoComponent book={this.state.book}/>
                        </div>
                        <div className="col l8">
                            <BookExtrasComponent id="bookExtras"/>
                        </div>
                    </div>
                    <div className="row" id="bookProfileBottom">
                        <BookRecommendComponent />
                    </div>
                </div>
            )
        }
    });
})
