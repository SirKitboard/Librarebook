define([
	'underscore',
	'react',
	'jsx!components/widgets/book'
], function(_, React, Book) {
	return React.createClass({
		render : function() {
			return (
				<div className="bookCarousel">
					{
						_.map(this.props.books, function(book) {
							return (
								<div style={{display:'inline-block'}}>
									<Book book={book}/>
								</div>
							)
						})
					}
				</div>
			)
		}
	})
})
