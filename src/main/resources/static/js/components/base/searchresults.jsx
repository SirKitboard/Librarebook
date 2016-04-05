define([
    'underscore',
    'react',
    'jsx!components/template/navbar',
    'jsx!components/searchprofile/results'
], function(_, React, NavigationBar, SearchResults) {
    return React.createClass({
        getInitialState : function() {
            var book = {
                title: null,
                description: null,
                author: null
            };
            books = []
            for (i=0; i<10; i++) {
                books.push(book)
            }
            return {
                'something' : true,
                'results': books
            }
        },

        componentDidMount: function() {
            $('.dropdown-button').dropdown();
            $(window).scroll(function(e){
                // console.log('hi');
              var $el = $('.fixedElement');
              console.log($(this).scrollTop());
              var isPositionFixed = ($el.css('position') == 'fixed');
              if ($(this).scrollTop() > 400 && !isPositionFixed){
                $('.fixedElement').css({'position': 'fixed', 'top': '64px'});
                console.log('fix!');
              }
              if ($(this).scrollTop() < 400 && isPositionFixed)
              {
                $('.fixedElement').css({'position': 'absolute', 'top': '464px'});
                console.log('unfix!');
              }
            });
        },

        render: function() {
            return(
                <div>
                    <div className="row searchBanner valign-wrapper"></div>
                    <div style={{background:'white', top:'464px'}}className="row tab-row searchTabs z-depth-1 fixedElement">
                        <div className="col s12">
                            <div className="tab col s4 dropdown-button" href='#' data-activates='genreDropdown' data-beloworigin="true">
                                <p className="center-align">Genre</p>
                            </div>
                            <div className="tab col s4 dropdown-button" href='#' data-activates='titleDropdown' data-beloworigin="true">
                                <p className="center-align">Title</p>
                            </div>
                            <div className="tab col s4 dropdown-button" href='#' data-activates='authorDropdown' data-beloworigin="true">
                                <p className="center-align">Author</p>
                            </div>
                        </div>
                    </div>
                    <div style={{paddingTop:'52px'}}className="row searchResults">
                        <SearchResults books={this.state.results}/>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1">
                                <button className="btn-large center-align" id="loadButton">Load More</button>
                            </div>
                        </div>
                    </div>

                    <ul id="genreDropdown" className='dropdown-content'>
                       <li><a href="#!">one</a></li>
                       <li><a href="#!">two</a></li>
                       <li><a href="#!">three</a></li>
                     </ul>

                     <ul id="titleDropdown" className="dropdown-content">
                         <li>
                             <form>
                                 <input type="text" />
                             </form>
                         </li>
                         <li><a href="#!">one</a></li>
                         <li><a href="#!">two</a></li>
                     </ul>

                     <ul id="authorDropdown" className="dropdown-content">
                         <li>
                             <form>
                                 <input type="text" />
                             </form>
                         </li>
                         <li><a href="#!">one</a></li>
                         <li><a href="#!">two</a></li>
                     </ul>
                </div>
            )
        }
    });
})
