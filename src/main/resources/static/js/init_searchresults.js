require([
    "react",
    "react-dom",
    "jsx!components/base/searchresults"
], function(React, ReactDOM, SearchResultComponent){
    var app = React.createElement(SearchResultComponent, {key:"a"})
    ReactDOM.render(app, document.getElementById('content'));
}, function(error){
    console.log(error)
    debugger;
}
)
