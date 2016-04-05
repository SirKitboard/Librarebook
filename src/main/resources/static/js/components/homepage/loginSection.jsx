define([
    'underscore',
    'react',
], function(_, React) {
    return React.createClass({
        getInitialState : function () {
            return null;
        },
        render : function() {
            return (
                <div className="homepage-section" id={"section-"+this.props.id}>
                    <h2 className="section-heading">Login</h2>
					<h4 className="section-heading">List features gained by logging in</h4>
					<div className="login-buttons container row">
                        <a className="waves-effect waves-light btn col s10 offset-s1 m4 offset-m1 l2 offset-l3">Login</a>
						<a className="waves-effect waves-light btn col s10 offset-s1 m4 offset-m2 l2 offset-l2">Signup</a>
					</div>
                </div>
            )
        }
    })
});
