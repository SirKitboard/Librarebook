define([
    'underscore',
    'react'
], function(_, React) {
    return React.createClass({
        componentDidMount : function() {
            $(document).ready(function(){
                $('.collapsible').collapsible({
                    accordion : false   
                });
            });
        },
        render: function() {
            return(
                <div className="container" style={{width:'90%', maxWidth:'none', marginTop: '80px'}}>
                    <div>
                    <p> FAQ/HELP</p>
                    </div>
                    <ul className="collapsible popout" data-collapsible="accordion">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Where can I sign up?</div>
                            <div className="collapsible-body"><p>In the home screen of our website there is a login button which gives you the opportunity to log in or sign up</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">place</i>Do I have to be logged in to view books?</div>
                            <div className="collapsible-body"><p>No, you can still view books without being logged in however you cannot check them out</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">whatshot</i>How many books can I check out at once?</div>
                            <div className="collapsible-body"><p>There is no limit! check out as many as you'd like </p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>How long can I reserve a book for?</div>
                            <div className="collapsible-body"><p>You can reserve a book for 3 days</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">place</i>Can I return a book early?</div>
                            <div className="collapsible-body"><p>Yes, there is always an option to return the book before the due date</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">whatshot</i>Can I buy a book through this site?</div>
                            <div className="collapsible-body"><p>Yes, if you'd like to buy the book there is a purchase button next to each book. Just click the button and follow the instructions</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Are there late fees if I don't return a book on time?</div>
                            <div className="collapsible-body"><p>No, there are no late fees. You lose access to the book once your due date arrives</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">place</i>How long can I checkout a book for?</div>
                            <div className="collapsible-body"><p>You can check out a book for 1 week</p></div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">whatshot</i>Is there a limit to how many books I can reserve? </div>
                            <div className="collapsible-body"><p>No, you can reserve as many as you'd like.</p></div>
                        </li>
                    </ul>

                </div>
            )
        }
    });
})
