define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'jsx!components/bookprofile/bookextras',
    'jsx!components/template/editbookmodal'
], function(_,React, BookInfoComponent, BookExtrasComponent, BookEditModal) {
    return React.createClass({
        getInitialState: function() {
            var loggedIn = false;
            if(window.currentUser)
            {
                loggedIn = true;
            }
            return {
                "book": {
                    "title": "",
                    "author": "",
                    "isbn": 12345678910,
                    "available": true,
                    "year": 1994,
                    "publisher": "John Doe"
                },
                loggedIn: loggedIn,
                editing : false
            }
        },
        toggleEditModal : function() {
            if(this.state.editing) {
                $("#modalEditBook").closeModal();
            } else {
                $("#modalEditBook").openModal();
            }
        },
        componentDidMount: function () {
            var self = this;
            $.ajax({
                url:"/api/items/books/"+window.bookID,
                method:"GET",
                success : function(response) {
                    self.setState({
                        'book' : response
                    });
                }
            })

            $(".modal-trigger").leanModal();
        },
        render: function() {
            return (
                <div id="profileContent">
                    <div className="row" id="bookProfileTop">
                        <div className="col l4">
                            <BookInfoComponent book={this.state.book} onEditClick={this.toggleEditModal} loggedIn={this.state.loggedIn}/>
                        </div>
                        <div className="col l8">
                            <BookExtrasComponent id="bookExtras"/>
                        </div>
                    </div>
                    <BookEditModal book={this.state.book}/>
                </div>
            )
        }
    });
})
