define([
	'underscore',
	'react'
], function(_, React) {
	return React.createClass({
		getInitialState : function() {
			return null;
		},
		render : function() {
			return(
				<div className="z-depth-1 book">
					<div><img className="cover" src="http://placehold.it/200x250"/></div>
					<div className="details">
						<span className="title">{this.props.book.title ? this.props.book.title : "Placeholder"}</span>
						<p className="author">{this.props.book.author ? this.props.book.author : "Author"}</p>
						<p className="author">{this.props.book.author ? this.props.book.author : "Rating"}</p>
						<div className="actions">
							<span className="action"><a href="bookprofile.html">View</a></span>
						</div>
					</div>
				</div>
			)
		}
	});
})
