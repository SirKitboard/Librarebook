define([
	'underscore',
	'react',
	'jsx!components/widgets/book'
], function(_, React, Book) {
	return React.createClass({
		render : function() {
			console.log(this.props.books);
			var self = this;
			if(Array.isArray(this.props.books)) {
				return (<div className="bookCarousel">
					{
						_.map(this.props.books, function(book) {
							return (
								<div style={{display:'inline-block'}}>
									<Book setView={self.props.setView} book={book}/>
								</div>
							)
						})
					}
				</div>)
			}
			return (
				<div className="bookCarousel">
					{
						_.map(_.keys(this.props.books), function(book) {
							return (
								<div style={{display:'inline-block'}}>
									<Book setView={self.props.setView} book={self.props.books[book]}/>
								</div>
							)
						})
					}
				</div>
			)
		}
	})
})
