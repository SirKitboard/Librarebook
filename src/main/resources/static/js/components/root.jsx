define([
    'underscore',
    'react',
    'jsx!components/template/navbar',
    'jsx!components/base/homepage',
    'jsx!components/base/bookprofile',
    'jsx!components/base/searchresults',
    'jsx!components/base/userprofile',
    'jsx!components/base/admindashboard',
    'jsx!components/base/faq',
    'stores/books',
    'actions/books',
    'stores/genres',
    'actions/genres'
], function(_,React, NavbarCompnent, HomepageComponent, BookprofileComponent, SearchResultsComponent, UserProfileComponent, AdminDashboardComponent, FaqComponent, BooksStore, BooksActions, GenresStore, GenresActions) {
    return React.createClass({
        getInitialState: function () {
            var URLHash = window.location.hash.substring(1);
            var view;
            if(URLHash == "") {
                view= 'view/home'
            }
            else {
                view = URLHash;
            }
            return {
                view : view,
                // stack: []
            }
        },
        setView: function(newView) {
            window.location.hash = newView;
            this.setState({
                view: newView
            })
        },
        setHash : function() {
            window.location.hash = this.state.view;
            window.location.reload();
        },
        componentWillMount: function() {
            if (window.currentUser) {
                var userFavorites = _.map(window.currentUser.favorites, function(book) {return book.id});
                window.currentUser.favoriteItemIDs = userFavorites;
                console.log(window.currentUser.favoriteItemIDs);
            }
            this.stores = {
                books: new BooksStore(),
                genres: new GenresStore()
            };
            this.stores.books.addChangeListener(this.onStoreUpdate);
            this.stores.books.addChangeListener(this.onStoreUpdate);
            BooksActions.pullRecents();
            GenresActions.pull();
        },
        onStoreUpdate: function() {
            this.forceUpdate();
        },
        componentDidMount : function() {
            window.addEventListener('unload',this.setHash);
            var self = this;
            window.onhashchange = function() {
                var URLHash = window.location.hash.substring(1);
                if(URLHash.split("/")[0] == "view" && self.state.view != URLHash) {
                    self.setState({
                        view: URLHash
                    });
                }
            };
        },
        render : function() {
            var componentRendered;
            var showNavShadow = true;
            var view = this.state.view.split("/");
            switch(view[1]) {
                case 'home':
                    componentRendered = <HomepageComponent stores={this.stores} setView={this.setView} view={this.state.view}/>
                    break;
                case 'profile':
                    componentRendered = <UserProfileComponent setView={this.setView} view={this.state.view}/>
                    break;
                case 'adminDashboard':
                    showNavShadow = false;
                    componentRendered = <AdminDashboardComponent setView={this.setView} view={this.state.view}/>
                    break;
                case 'bookProfile':
                    componentRendered = <BookprofileComponent stores={this.stores} setView={this.setView} view={this.state.view}/>
                    break;
                case 'searchResults':
                    componentRendered = <SearchResultsComponent stores={this.stores} setView={this.setView} view={this.state.view}/>
                    break;
                case 'faq':
                    componentRendered = <FaqComponent/>

            }
            return (
                <div>
                    <div>
                        {componentRendered}
                    </div>
                    <div id='navigation'><NavbarCompnent stores={this.stores} showShadow={showNavShadow} setView={this.setView}/></div>
                    <div id="dark-cover"></div>
                    <div id='cart' className="z-depth-2"></div>
                </div>
            )
        }
    });
});