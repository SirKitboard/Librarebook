define([
    'underscore',
    'react',
    'jsx!components/template/navbar',
    'jsx!components/base/homepage',
    'jsx!components/base/bookprofile',
    'jsx!components/base/searchresults',
    'jsx!components/base/userprofile',
    'jsx!components/base/admindashboard'
], function(_,React, NavbarCompnent, HomepageComponent, BookprofileComponent, SearchResultsComponent, UserProfileComponent, AdminDashboardComponent) {
    return React.createClass({
        getInitialState: function () {
            var URLHash = window.location.hash.substring(1);
            var view;
            if(URLHash == "") {
                view = {
                    view: 'home'
                };
                // window.location.hash = JSON.stringify(view);
            }
            else {
                view = JSON.parse(URLHash);
            }
            window.location.hash = "";
            return {
                view : view
            }
        },
        setView: function(newView) {
            this.setState({
                view: newView
            })
        },
        setHash : function() {
            window.location.hash = JSON.stringify(this.state.view);
            window.location.reload();
        },
        componentDidMount : function() {
            window.addEventListener('unload',this.setHash);
        },
        render : function() {
            var componentRendered;
            var showNavShadow = true;
            switch(this.state.view.view) {
                case 'home':
                    componentRendered = <HomepageComponent setView={this.setView} view={this.state.view}/>
                    break;
                case 'profile':
                    componentRendered = <UserProfileComponent setView={this.setView} view={this.state.view}/>
                case 'adminDashboard':
                    showNavShadow = false;
                    componentRendered = <AdminDashboardComponent setView={this.setView} view={this.state.view}/>
            }
            return (
                <div>
                    <div>
                        {componentRendered}
                    </div>
                    <div id='navigation'><NavbarCompnent showShadow={showNavShadow} setView={this.setView}/></div>
                    <div id="dark-cover"></div>
                    <div id='cart' className="z-depth-2"></div>
                </div>
            )
        }
    });
});