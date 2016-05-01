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
        shareToTwitter: function() {
            window.open("https://twitter.com/intent/tweet?url="+encodeURIComponent(window.location.href));
        },
        shareToPinterest: function() {
            window.open("http://pinterest.com/pin/create/button/?url="+encodeURIComponent(window.location.href)+"&media="+this.props.book.coverImageUrl+"&description=Librarebook")
        },
        render: function() {
            return (
                <div className="row">
                    <ul className="tabs">
                        <li className="tab"><a className="active" href="#share">Share</a></li>
                        {this.props.loggedIn ? <li className="tab"><a href="#email">Email</a></li> : null }
                    </ul>
                    <div id="share" className="col s12">
                        <a onClick={this.shareToFacebook} className="share-button"><img className="z-depth-1" src="/img/square-facebook-128.png"/></a>
                        <a onClick={this.shareToTwitter} className="share-button"><img className="z-depth-1" src="/img/Twitter-icon.png"/></a>
                        <a onClick={this.shareToPinterest} className="share-button"><img className="z-depth-1" src="/img/pinterest.png"/></a>
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