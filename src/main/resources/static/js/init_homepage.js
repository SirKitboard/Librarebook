require([
    'react',
    'react-dom',
    'jsx!components/base/homepage'
], function(React, ReactDOM, HomepageComponent){
    var app = React.createElement(HomepageComponent)
    ReactDOM.render(app, document.getElementById('content'));
}, function(error){
    console.log(error)
    debugger;
}
)
