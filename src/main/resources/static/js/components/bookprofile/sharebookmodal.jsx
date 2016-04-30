define([
    'underscore',
    'react',
    'jsx!components/bookprofile/bookinfo',
    'actions/books',
], function (_, React, BookInfoComponent, BookActions) {
    return React.createClass({
        getInitialState: function() {
            return {
                "book": this.props.book
            }
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                book: nextProps.book
            })
        },
        componentDidMount: function() {
            this.setState({
                book: this.props.book
            })
        },

        shareByEmail: function() {
            BookActions.sendEmail(this.refs, this.props.book.id);
        },
        shareToFacebook: function() {
            window.open("https://www.facebook.com/sharer/sharer.php?u="+window.location.href)
        },
        render: function() {
            return (
                <div className="row">
                    <ul className="tabs">
                        <li className="tab"><a className="active" href="#share">Share</a></li>
                        {this.props.loggedIn ? <li className="tab"><a href="#email">Email</a></li> : null }
                    </ul>
                    <div id="share" className="col s12">
                        <a onClick={this.shareToFacebook} className="fb-share-button" data-href={window.location.href} data-layout="button" data-mobile-iframe="true"><img src="/img/square-facebook-128.png"/></a>
                    </div>
                    {this.props.loggedIn ? <div id="email" className="input-field col s12">
                        <input ref="emailInput" id="emailInput" placeholder="To" type="email" className="col s11 validate"/>
                        <a href="#" onClick={this.shareByEmail}><i className="material-icons">send</i></a>
                    </div> : null }
                </div>
            )
        }
    });
});