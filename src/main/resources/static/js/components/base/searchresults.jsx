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
                results: null,
                loading: true,
                page:'0',
                moreContent: true,
                displayMode: "list",
                sort: "",
                ord: ""
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
        fetchBooks: function(view, page, sort, ord) {
            if(!sort) {
                sort = this.state.sort;
            }
            if(!ord) {
                ord = this.state.order;
            }
            this.setState({
                loading: true
            });
            var params = {}
            view = view.split("query?").slice(-1)[0];
            view = view.split("&");
            _.each(view, function(param) {
                param = param.split("=");
                if(param[0] == "genres") {
                    params[param[0]] = param[1].split(",");
                } else {
                    params[param[0]] = param[1];
                }
            });
            params['page'] = page;
            // console.log(params);
            if(sort != "") {
                params['sort'] = sort;
                params['ord'] = ord;
            }

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
            this.fetchMoreBooks();
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
            });
        },
        componentWillMount: function() {
            this.initalFetch(this.props.view);
        },
        componentWillUpdate: function(nextProps, nextState) {
            if(nextProps.view != this.props.view) {
                this.fetchBooks(nextProps.view, 0);
            }
            else if(nextState.sort != this.state.sort || nextState.order != this.state.order) {
                this.fetchBooks(nextProps.view, 0, nextState.sort, nextState.order);
            }
        },
        componentDidMount: function() {
            $('#sortSelect').material_select();
            $('#ordSelect').material_select();

            var self = this;

            $(window).bind("scroll.infinite-scroll", function(e){
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
            });
        },
        componentWillUnmount: function() {
            $(window).unbind("scroll.infinite-scroll");
        },
        toggleDisplayMode: function() {
            this.setState({
                displayMode: this.state.displayMode == "grid" ? "list" : "grid"
            })
        },
        updateRequest: function() {
            this.setState({
                sort: this.refs.sortSelect.value,
                order: this.refs.ordSelect.value,
                results: []
            });
        },
        render: function() {
            return(
                <div id="searchResultComponent" className="padNav">
                    <div className="row searchBanner valign-wrapper"></div>
                    <div style={{background:'white', top:'464px'}}className="row tab-row searchTabs z-depth-1 fixedElement">
                        <div className="col s12">
                            <div className="tab col s3 dropdown-button" href='#' data-activates='genreDropdown' data-beloworigin="true">
                                <p className="center-align">Genre</p>
                            </div>
                            <div className="input-field col s4 center-align">
                                <select ref="sortSelect" id="sortSelect" defaultValue="">
                                    <option value="" disabled>Sort By</option>
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                    <option value="publisher">Publisher</option>
                                    <option value="popularity">Popularity</option>
                                </select>
                                <label>Sort By</label>
                            </div>
                            <div className="input-field col s3 center-align">
                                <select id="ordSelect" ref="ordSelect" defaultValue="">
                                    <option value="" disabled>Order</option>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                                <label>Order</label>
                            </div>
                            <div style={{marginTop: '22px'}} className="col s2 btn waves-effect waves-light" onClick={this.updateRequest}>
                                Update
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
                    <div style={{paddingTop:'80px'}}className="row searchResults">
                        <SearchResults fetchMoreBooks={this.fetchMoreBooks} display={this.state.displayMode} setView={this.props.setView} books={this.state.results}/>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1" style={{textAlign: 'center'}}>
                                {this.state.moreContent ? (this.state.loading ? <Preloader className="center-align"/> : <button onClick={this.fetchMoreBooks} className="btn-large waves-effect waves-light center-align" id="loadButton">Load More</button>): <span style={{color:'#AAA'}}>End of results</span> }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
