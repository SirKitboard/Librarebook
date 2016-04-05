require([
    "react",
    "react-dom",
    "jsx!components/base/bookprofile"
], function(React, ReactDOM, BookprofileComponent) {
    var app = React.createElement(BookprofileComponent);
    ReactDOM.render(app, document.getElementById('content'));
}, function(error) {

});
