define([
    'underscore',
    'react',
    'jsx!components/admindashboard/reportsTab'
], function(_,React, ReportsTab) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            return null;
        },
        render: function() {
            return (
                <div id="reportsTab" className="row">
                    <div className="col s12 m3 topResults">
                        Top Search Results
                    </div>
                    <div className="col s12 m9 mostDownloaded">
                        Most Downloaded Books
                    </div>
                </div>
            )
        }
    });
})
