require([
    "react",
    "react-dom",
    "jsx!components/base/admindashboard"
], function(React, ReactDOM, AdminDashboardComponent) {
    var app = React.createElement(AdminDashboardComponent);
    ReactDOM.render(app, document.getElementById('content'));
}, function(error) {

});
