define([
    "underscore",
    "react",
], function(_, React) {
    return React.createClass({
        getInitialState: function(){
            return null;
        },

        render: function() {
            var imageURL = "http://placehold.it/75x75";
            if(this.props.user.coverImageUrl && this.props.user.coverImageUrl.length > 0) {
                imageURL = this.props.user.coverImageUrl;
            }
            // console.log(this.props);
            return (
                <div data-id={this.props.id} onClick={this.props.setUser} className="cart-book" style={{position:'relative', margin:'5px', padding:'5px'}}>
                    <img style={{width:'75px', height:'75px'}} className="cover" src={imageURL}/>
                    <div style={{position:'absolute', top:'0px', paddingLeft:'84px'}}>{this.props.user.firstName} {this.props.user.lastName}</div>
                </div>
            )
        }
    });
})
