define([
    'underscore',
    'react'
], function(_, React) {
    return React.createClass({
        getInitialState: function() {
            var hortizontalAds = ["Ad-lit_banner_0.png", "banner.PNG", "banner2.PNG", "cda_displayimage.jpg", "Inkbok Promotional Banner Ad.jpg"];
            var verticalAds = ["vertbanner1.png","vertbanner2.jpg","vertbanner3.png","vertbanner4.png"];
            if(this.props.orientation == "horizontal") {

            }
            var random = Math.floor(Math.random()*hortizontalAds.length);
            return {
                horizontalAds : hortizontalAds,
                verticalAds: verticalAds,
                random: random
            }
        },
        render: function() {
            if(this.props.orientation == "horizontal") {
                return (
                    <div style={{width: '100%'}} className="ads-container">
                        <img style={{width: '100%', height: 'auto'}} src={"/img/ads/"+this.state.horizontalAds[this.state.random]}/>
                    </div>
                )
            }
            return (
                <div style={{width: '100%', padding: '10px'}} className="ads-container">
                    <img style={{width: '100%', height: '850px'}} src={"/img/ads/"+this.state.verticalAds[this.state.random]}/>
                </div>
            )
        }
    })
});