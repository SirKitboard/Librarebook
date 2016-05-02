define([
    "underscore",
    "react",
], function(_, React) {
    return React.createClass({
        getInitialState: function(){
			return null;
        },

        render: function() {
			console.log(this.props.setUser);
			return (
				<div data-id={this.props.id} onClick={this.props.setUser} className="cart-book" style={{position:'relative', margin:'5px', padding:'5px'}}>
					<img className="cover" src="http://placehold.it/75x75"/>
					<i style={{position:'absolute', top:'3px', right:'3px'}}className="material-icons">close</i>
					<span style={{position:'relative', top:'-62px', marginLeft:'5px'}}>{this.props.book.title ? this.props.book.title : "Placeholder"}</span>
				</div>
			)
		}
    });
})
