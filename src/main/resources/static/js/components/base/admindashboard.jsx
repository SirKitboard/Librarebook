define([
    'underscore',
    'react',
    'jsx!components/admindashboard/reportsTab',
    'jsx!components/admindashboard/booksTab',
    'jsx!components/admindashboard/userstab',
    'jsx!components/admindashboard/publisherstab'
], function(_,React, ReportsTab, BooksTab, UsersTab, PublishersTab) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            var tab = 0;
            if(this.props.view.split("/")[2]) {
                tab = this.props.view.split("/")[2]
            }
            return {
                selectedTab : tab
            }
        },
        componentDidMount: function() {
            $("#adminTabsIndicator").animate({
                left: $("#adminTabs li.tab")[0].offsetWidth * this.state.selectedTab,
                width: $("#adminTabs li.tab")[0].offsetWidth - 10
            }, 300);
        },
        switchTab : function(e) {
            var target = e.target;
            // debugger;

            var index = parseInt(e.target.getAttribute("data-index"));
            this.setState({
                selectedTab : index
            })
            var element = $(e.target);
            var position = element.offset();
            var width = element.width();
            // debugger;
            $("#adminTabsIndicator").animate({
                left: position.left,
                width: width - 5
            }, 300);
            this.props.setView("view/adminDashboard/"+index)
        },
        render: function() {
            var tab = null;
            switch(this.state.selectedTab) {
                case 0:
                    tab = <ReportsTab/>
                    break;
                case 1:
                    tab = <BooksTab/>
                    break;
                case 2:
                    tab = <UsersTab/>
                    break;
                case 3:
                    tab = <PublishersTab/>
                    break;
            }
            return (
                <div id="adminPanel" className="padNav">
                    <div className="white row z-depth-1">
                        <div className="col s12" id="adminTabs">
                          <ul className="tabs">
                            <li className="tab col s3"><a data-index="0" onClick={this.switchTab}>Reports</a></li>
                            <li className="tab col s3"><a data-index="1" onClick={this.switchTab}>Books</a></li>
                            <li className="tab col s3"><a data-index="2" onClick={this.switchTab}>Users</a></li>
                            <li className="tab col s3"><a data-index="3" onClick={this.switchTab}>Publishers</a></li>
                            <div id="adminTabsIndicator" className="indicator"/>
                          </ul>
                        </div>
                    </div>
                    {tab}
                </div>
            )
        }
    });
})
