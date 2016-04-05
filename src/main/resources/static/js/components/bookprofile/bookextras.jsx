define([
    'underscore',
    'react'
], function(_, React) {
    return React.createClass({
        componentDidMount: function() {
            $('ul.tabs').tabs();
        },

        render: function() {
            return (
                <div>
                    <div className="row tab-row">
                        <div className="col s12">
                          <ul className="tabs">
                            <li className="tab col s6"><a className="active" href="#imagesTab">Images</a></li>
                            <li className="tab col s6"><a href="#reviewsTab">Reviews</a></li>
                          </ul>
                        </div>
                        <div id="imagesTab" className="col s12 valign-wrapper">
                            <img src="http://placehold.it/500x700" className="valign"/>
                        </div>
                        <div id="reviewsTab" className="col s12">Reviews</div>
                    </div>
                </div>
            )
        }
    });
})
