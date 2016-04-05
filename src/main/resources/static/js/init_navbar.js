require([
    'react',
    'react-dom',
    'jsx!components/template/navbar'
], function(React, ReactDOM, NavBarComponent){
    var app = React.createElement(NavBarComponent)
    ReactDOM.render(app, document.getElementById('navigation'));
}, function(error){
    console.log(error)
    debugger;
}
)
