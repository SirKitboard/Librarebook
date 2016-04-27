define([
    'underscore',
    'react',
    'jsx!components/template/navbar',
    'jsx!components/widgets/preloader',
    'jsx!components/searchprofile/results',
    'actions/books'
], function(_, React, NavigationBar, Preloader, SearchResults, BookActions) {
    return React.createClass({
        getInitialState : function() {
            return {
                'results': null,
                loading: true,
                page:'0',
                moreContent: true,
                displayMode: "list"
            }
        },
        initalFetch: function(view) {
            this.setState({
                page: 0
            })
            this.fetchBooks(view, 0);
        },
        fetchMoreBooks: function() {
            if(!this.state.loading) {
                this.fetchBooks(this.props.view, this.state.page)
            }
        },
        fetchBooks: function(view, page) {
            this.setState({
                loading: true
            });
            var params = {}
            view = view.split("query?").slice(-1)[0];
            view = view.split("&");
            _.each(view, function(param) {
                param = param.split("=");
                params[param[0]] = param[1];
            });
            params['page'] = page;
            // console.log(params);
            if(page == 0) {
                BookActions.search(params, this.setBooks, this.eor);
            } else {
                BookActions.search(params, this.appendBooks, this.eor);
            }

        },
        setBooks: function(books) {
            this.setState({
                results: books,
                loading: false,
                page: 1
            })
        },
        eor: function () {
            this.setState({
                moreContent: false
            })
        },
        appendBooks: function(books) {
            books = this.state.results.concat(books);
            this.setState({
                results: books,
                loading: false,
                page: this.state.page + 1
            })
        },
        componentWillMount: function() {
            this.initalFetch(this.props.view);
        },
        componentWillUpdate: function(nextProps, nextState) {
            if(nextProps.view != this.props.view) {
                this.fetchBooks(nextProps.view);
            }
        },
        componentDidMount: function() {
            $('.dropdown-button').dropdown();
            var self = this;
            $(window).scroll(function(e){
                // console.log('hi');
                var $el = $('.fixedElement');
                var isPositionFixed = ($el.css('position') == 'fixed');
                if ($(this).scrollTop() > 400 && !isPositionFixed){
                    $('.fixedElement').css({'position': 'fixed', 'top': '64px'});
                    $('nav').css({'box-shadow': 'none'})
                }
                if ($(this).scrollTop() < 400 && isPositionFixed) {
                    $('.fixedElement').css({'position': 'absolute', 'top': '464px'});
                    $('nav').css({'box-shadow':'0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)'})
                }
                if(self.state.moreContent) {
                    if ($(this).scrollTop() > $(document).height() - $(this).height() - 200) {
                        self.fetchMoreBooks();
                    }
                }
            });
        },
        toggleDisplayMode: function() {
            this.setState({
                displayMode: this.state.displayMode == "grid" ? "list" : "grid"
            })
        },
        render: function() {
            return(
                <div id="searchResultComponent" className="padNav">
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
                        <div className="display-mode">
                            <div className="switch">
                                <label>
                                    <i className="material-icons">grid_on</i> Grid
                                    <input onClick={this.toggleDisplayMode} defaultChecked={this.state.displayMode == "list"} type="checkbox"/>
                                    <span className="lever"></span>
                                    List <i className="material-icons">list</i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div style={{paddingTop:'52px'}}className="row searchResults">
                        <SearchResults display={this.state.displayMode} setView={this.props.setView} books={this.state.results}/>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1" style={{textAlign: 'center'}}>
                                {this.state.moreContent ? (this.state.loading ? <Preloader className="center-align"/> : <button onClick={this.fetchMoreBooks} className="btn-large waves-effect waves-light center-align" id="loadButton">Load More</button>): <span style={{color:'#AAA'}}>End of results</span> }
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
