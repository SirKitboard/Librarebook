define([
	'underscore',
	'react'
], function(_, React) {
	return React.createClass({
		getInitialState : function() {
			console.log(this.props.book);
			return null;
		},
		gotoBook : function() {
			this.props.setView({
				view: 'bookProfile',
				bookID: this.props.book.id
			});
		},
		render : function() {
			// debugger;
			var imageURL = "http://placehold.it/200x250";
			if(this.props.book.coverImageUrl && this.props.book.coverImageUrl.length > 0) {
				imageURL = this.props.book.coverImageUrl;
			}
			return(
				<div className="z-depth-1 book">
					<div><img className="cover" src={imageURL}/></div>
					<div className="details">
						<span style={{whiteSpace:"initial", top: '180px'}}className="title">{this.props.book.title ? this.props.book.title : "Placeholder"}</span>
						<p className="author">{this.props.book.authors[0] ? this.props.book.authors[0].firstName + " " + this.props.book.authors[0].lastName : "Author"}</p>
						<p className="author">{this.props.book.author ? this.props.book.author : "Rating"}</p>
						<div className="actions">
							<span className="action"><a href="#" onClick={this.gotoBook}>View</a></span>
						</div>
					</div>
				</div>
			)
		}
	});
})
