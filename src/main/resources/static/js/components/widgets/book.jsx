define([
	'underscore',
	'react'
], function(_, React) {
	return React.createClass({
		getInitialState : function() {
			return null;
		},
		gotoBook : function() {
			this.props.setView("view/bookProfile/"+this.props.book.id);
		},
		render : function() {
			// debugger;
			if(!this.props.book) {
				return null;
			}
			var imageURL = "http://placehold.it/200x250";
			if(this.props.book.coverImageUrl && this.props.book.coverImageUrl.length > 0) {
				imageURL = this.props.book.coverImageUrl;
			}
			var backgroundStyle = {
				backgroundImage: 'url("'+imageURL+'")',
				backgroundSize: "cover"
			};
			var title = this.props.book.title;

			if(title && title.length > 35) {
				title = title.substr(0, 32) + "..."
			}
			return(
				<div className="z-depth-1 book">
					<div className="cover" style={backgroundStyle}>
						<span style={{whiteSpace:"initial"}}className="title">{title ? title : "Placeholder"}</span>
					</div>
					<div className="details">
						<p className="author">{this.props.book.authors[0] ? this.props.book.authors[0].firstName + " " + this.props.book.authors[0].lastName : "Author"}</p>
						<p className="author">{this.props.book.author ? this.props.book.author : "Rating"}</p>
						<div className="actions">
							<span className="action"><a onClick={this.gotoBook}>View</a></span>
						</div>
					</div>
				</div>
			)
		}
	});
})
