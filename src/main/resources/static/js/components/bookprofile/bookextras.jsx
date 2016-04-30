define([
    'underscore',
    'react'
], function(_, React) {
    return React.createClass({
        componentDidMount: function() {
            $('ul.tabs').tabs();
        },

        render: function() {
            var imageURL = "http://placehold.it/500x700";
            if(this.props.book.coverImageUrl && this.props.book.coverImageUrl.length > 0) {
                imageURL = this.props.book.coverImageUrl;
            }

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
                            <img style={{width:'500px', height:'auto'}} src={imageURL} className="valign"/>
                        </div>
                        <div id="reviewsTab" className="col s12">
                            <a href="#modalReview" className="modal-trigger shareModalTrigger btn">Rate Book</a>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
