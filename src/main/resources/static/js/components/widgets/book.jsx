define([
	'underscore',
	'react'
], function(_, React) {
	return React.createClass({
		getInitialState : function() {
			return null;
		},
		render : function() {
			console.log(this.props.book.authors);
			return(
				<div className="z-depth-1 book">
					<div><img className="cover" src="http://placehold.it/200x250"/></div>
					<div className="details">
						<span style={{whiteSpace:"initial", top: '180px'}}className="title">{this.props.book.title ? this.props.book.title : "Placeholder"}</span>
						<p className="author">{this.props.book.authors[0] ? this.props.book.authors[0].firstName + " " + this.props.book.authors[0].lastName : "Author"}</p>
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
