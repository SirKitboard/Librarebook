
define([
    '../../bower_components/underscore/underscore',
    'react'
], function(_, React) {
    return React.createClass({
        componentDidMount: function() {
            $('ul.tabs').tabs();
        },

        render: function() {
            return (
                <div className="edit-user">
                    <div className="modal-content">
                        <div className="row">
                            <h4>Update profile</h4>
                        </div>

                        <div className="row contact header">
                            <span>Contact Info </span>
                            <i className="material-icons">info_outline</i>
                        </div>
                        <div className="row">
                            <div className="input-field col s12 m6">
                                <input ref="first_name" id="first_name" type="text" className="validate" defaultValue={window.currentUser.firstName}/>
                                <label className="active" htmlFor="first_name">First Name</label>
                            </div>
                            <div className="input-field col s12 m6">
                                <input ref="last_name" id="last_name" type="text" className="validate" defaultValue={window.currentUser.lastName}/>
                                <label className="active" htmlFor="last_name">Last Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input ref="email" id="email" type="email" className="validate" defaultValue={window.currentUser.email}/>
                                <label className="active" htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input ref="phone" id="phone" type="tel" className="validate" defaultValue={window.currentUser.phone}/>
                                <label className="active" htmlFor="phone">Phone</label>
                            </div>
                        </div>
                        <button onClick={this.handleUpdate} className="btn waves-effect waves-light button-right"
                                id='login' type="submit" name="action">
                            <span>Submit</span>
                            <i className="material-icons right">send</i>
                        </button>

                    </div>

                </div>
            )
        }
    });
})


















