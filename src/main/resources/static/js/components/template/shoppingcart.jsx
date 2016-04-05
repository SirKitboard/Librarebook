define([
    "underscore",
    "react",
	'jsx!components/template/book'
], function(_, React, BookComponent) {
    return React.createClass({
        getInitialState: function(){
            // debugger;
            var loggedIn = false
            if(window.location.hash == '#loggedIn') {
                loggedIn = true
            }
            return {
                'loggedIn': loggedIn
            }
        },
        render: function() {
			return (
				<div>
					<div className="books">
						{_.map(this.props.books, function(book){
							return (
                               <BookComponent book={book}/>

							);
						})}

					</div>
					<div className="actions">
						<a className="waves-effect waves-light btn">Checkout</a>
						<a className="waves-effect waves-light btn" onClick={this.props.onClose}>Close</a>
					</div>
				</div>
			)
		}
    });
})
