define([
    'underscore',
    'react',
    'jsx!components/template/navbar',
    'jsx!components/base/homepage',
    'jsx!components/base/bookprofile',
    'jsx!components/base/searchresults',
    'jsx!components/base/userprofile'
], function(_,React, NavbarCompnent, HomepageComponent, BookprofileComponent, SearchResultsComponent, UserProfileComponent) {
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
        setHash : function() {
            window.location.hash = JSON.stringify(this.state.view);
            window.location.reload();
        },
        componentDidMount : function() {
            window.addEventListener('unload',this.setHash);
        },
        render : function() {
            var componentRendered;
            switch(this.state.view.view) {
                case 'home':
                    componentRendered = <HomepageComponent />
            }
            return (
                <div>
                    <div>
                        {componentRendered}
                    </div>
                    <div id='navigation'><NavbarCompnent /></div>
                    <div id="dark-cover"></div>
                    <div id='cart' className="z-depth-2"></div>
                </div>
            )
        }
    });
});