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
                author: null
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
        render: function() {
            if(this.state.loggedIn) {
                var recommendedSection = <Section books={this.state.popular} title='Recommended Books' id="Recommended"/>
            } else {
                var loginSection = <LoginSection id="login"/>;
            }
            var popularSection = <Section books={this.state.popular} title='Popular Books' id="popular"/>;
            var newReleasesSection = <Section books={this.state.popular} title='New Releases' id="new"/>;

            // var
            return(
                <div>
                    {loginSection}
                    {popularSection}
                    {newReleasesSection}
                    {recommendedSection}
                </div>
            )
        }
    });
})
