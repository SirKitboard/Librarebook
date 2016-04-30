define([
    'underscore',
    'react',
    'jsx!components/homepage/section',
    'jsx!components/homepage/loginSection'
], function(_, React, Section, LoginSection) {
    return React.createClass({
        getInitialState : function() {
            var loggedIn = false
            if(window.location.hash == '#loggedIn') {
                loggedIn = true
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
                 loggedIn: loggedIn
            }
        },
        componentDidMount: function() {
            $('.parallax').parallax();
        },
        render: function() {
            if(this.state.loggedIn) {
                var recommendedSection = <Section books={this.state.popular} title='Recommended Books' id="Recommended"/>
                var recommendParalax = (
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-332800.jpg"/></div>
                    </div>
                )
            } else {
                var loginSection = <LoginSection id="login"/>;
                var loginParalax = (
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-332800.jpg"/></div>
                    </div>
                )
            }
            var popularSection = <Section books={this.state.popular} title='Popular Books' id="popular"/>;
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
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-321572.jpg"/></div>
                    </div>
                    {popularSection}
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-246627.jpg"/></div>
                    </div>
                    {newReleasesSection}
                    <div className="parallax-container">
                        <div className="parallax"><img src="http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-321572.jpg"/></div>
                    </div>
                    {recommendedSection}
                    {recommendParalax}
                </div>
            )
        }
    });
})
