define([
    'underscore',
    'react',
    'jsx!components/template/book'
], function(_,React, Book) { //, BookInfoComponent, BookExtrasComponent, BookRecommendComponent) {
    return React.createClass({
        getInitialState: function() {
            var publisher = {
                "title": "Publisher name"
            }
            return {
                publishers : [publisher, publisher, publisher, publisher, publisher, publisher, publisher],
                selectedBook: 0
            }
        },
        render: function() {
            return (
                <div id="publishersTab" className="row">
                    <div className="col s12 m3 publisherList">
                        <div className="input-field">
                          <i className="material-icons prefix">search</i>
                          <input id="search" type="text" className="validate"/>
                          <label htmlFor="search">Search</label>
                        </div>
                        <ul>
                            {
                                _.map(this.state.publishers, function(publisher) {
                                    return (
                                        <li>
                                            <Book book={publisher}/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="col s12 m9 publisherDetails">
                        <div className="coverPic">
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col offset-s1 s3 offset-m1 m3 offset-l1 l2">
                                    <img className="propic z-depth-1" src="http://placehold.it/200x200"/>
                                </div>
                                <div className="col s5  l6">
                                    <h4 className="publishername">Publisher Name</h4>
                                    <h5 className="publisher-role">Role</h5>
                                    <h6 className="publisher-email">Email : <a href="mailto:xxx@xx.com">email@mail.com</a></h6>
                                    <h6 className="publisher-status">Status : Active</h6>
                                    <h6 className="publisher-website">Website : <a href="mailto:xxx@xx.com">www.aaa.com</a></h6>
                                </div>
                                <div className="col s3 l3">
                                    <a className="btn waves-effect waves-light">Go To Page</a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col offset-s2 s8 offset-m1 m3 offset-l1 l2">
                                    <ul className="navigateTo">
                                        <li><i className="material-icons prefix">person</i>Profile</li>
                                        <li><i className="material-icons prefix">book</i>Books</li>
                                    </ul>
                                </div>
                                <div className="col s12 m8 l9">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel pulvinar mi. Cras commodo feugiat congue. Nulla ut lobortis eros, sit amet porta dolor. Maecenas nec massa ut tortor tempus cursus. Phasellus interdum, mi at ornare faucibus, tortor turpis consectetur felis, id finibus mauris tortor sed sem. Nunc ultricies, augue id lobortis ullamcorper, ligula enim pharetra purus, vitae euismod enim mauris a augue. Integer mattis egestas dapibus. Duis pharetra felis quis feugiat imperdiet. Nulla convallis maximus ligula, in sagittis sem fermentum quis. Integer posuere augue ac turpis aliquet, non dignissim tellus lacinia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });
})
