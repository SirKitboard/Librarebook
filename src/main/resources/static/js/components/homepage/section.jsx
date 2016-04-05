define([
    'underscore',
    'react',
    'jsx!components/widgets/bookCarousel'
], function(_, React, BookCarousel) {
    return React.createClass({
        getInitialState : function () {
            return null;
        },
        render : function() {
            return (
                <div className="homepage-section" id={"section-"+this.props.id}>
                    <h2 className="section-heading">{this.props.title}</h2>
                    <div className="books">
                        <BookCarousel books={this.props.books}/>
                    </div>
                </div>
            )
        }
    })
});
