define([
	'underscore',
	'react'
], function(_, React) {
	return React.createClass({
		getInitialState : function() {
			var book = this.props.stores.books.getBookOrPull(this.props.recom.item)
			return {
				book: book
			}
		},
		gotoBook : function() {
			this.props.setView("view/bookProfile/"+this.state.id);
		},
		componentWillUpdate: function(nextProps, nextState) {
			if(!this.state.book) {
				var book = this.props.stores.books.getBookOrPull(this.props.recom.item);
				nextState.book = book;
			}
		},
		render : function() {
			if(!this.state.book) {
				return null;
			}
			// debugger;
			var imageURL = "http://placehold.it/200x250";
			if(this.state.book.coverImageUrl && this.state.book.coverImageUrl.length > 0) {
				imageURL = this.state.book.coverImageUrl;
			}
			var backgroundStyle = {
				backgroundImage: 'url("'+imageURL+'")',
				backgroundSize: "cover"
			};
			var title = this.state.book.title;

			if(title && title.length > 35) {
				title = title.substr(0, 32) + "..."
			}
			var status = <div>Pending</div>;
			if(this.props.recom.status == 1) {
				status = <div className="green-text">Approved</div>
			} else if(this.props.recom.status == -1) {
				status = <div className="red-text">Rejected</div>
			}
			return(
				<div className="z-depth-1 book">
					<div className="cover" style={backgroundStyle}>
						<span style={{whiteSpace:"initial"}}className="title">{title ? title : "Placeholder"}</span>
					</div>
					<div className="details">
						<div className="author">{this.state.book.authors[0] ? this.state.book.authors[0].firstName + " " + this.state.book.authors[0].lastName : "Author"}</div>
						{status}
						<div className="actions">
							<span className="action"><a onClick={this.gotoBook}>View</a></span>
						</div>
					</div>
				</div>
			)
		}
	});
})
