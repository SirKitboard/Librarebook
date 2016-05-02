define([
    'underscore',
    'react',
    'jsx!components/homepage/section',
    'jsx!components/homepage/loginSection'
], function(_, React, Section, LoginSection) {
    return React.createClass({
        getInitialState : function() {
            var loggedIn = false;
            var random = null;
            if(window.currentUser) {
                loggedIn = true
                var array = window.currentUser.checkoutHistory.concat(window.currentUser.currentlyCheckedOutItems);
                var random = Math.floor(Math.random() * array.length);
                if (array[random]) {
                    this.props.stores.books.getRecommendedOrPull(array[random].item);
                    random = array[random].item
                }
            }

            var book = {
                title: null,
                description: null,
                authors: []
            }
            books = [book, book, book, book]
            return {
                 'something' : true,
                 'login' : books,
                 'popular' : books,
                 'newRelease' : books,
                 loggedIn: loggedIn,
                 random: random,
            }
        },
        componentDidMount: function() {
            $('.parallax').parallax();
        },
        render: function() {
            if(this.state.loggedIn) {
                var recommendedSection = <Section setView={this.props.setView} books={this.props.stores.books.getRecommended(this.state.random)} title='Recommended Books' id="Recommended"/>
                var recommendParalax = (
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-332800.jpg"/></div>
                    </div>
                )
            } else {
                var loginSection = <LoginSection id="login"/>;
                var loginParalax = (
                    <div className="parallax-container">
                        <div className="parallax"><img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-123787.jpg"/></div>
                    </div>
                )
            }
            var popularSection = <Section setView={this.props.setView} books={this.props.stores.books.getBestSellers()} title='Popular Books' id="popular"/>;
            var newReleasesSection = <Section setView={this.props.setView} books={this.props.stores.books.getRecents()} title='New Releases' id="new"/>;

            // var
            var style = {
                height: '2000px'
            };
            return(
                <div id="homepageComponent" style={{style}}>
                    {loginParalax}
                    {loginSection}
                    <div className="parallax-container">
                        <div className="parallax"><img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-156539.jpg"/></div>
                    </div>
                    {popularSection}
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-246627.jpg"/></div>
                    </div>
                    {newReleasesSection}
                    <div className="parallax-container">
                        <div className="parallax"><img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-357501.jpg"/></div>
                    </div>
                    {recommendedSection}
                    {recommendParalax}
                </div>
            )
        }
    });
})
