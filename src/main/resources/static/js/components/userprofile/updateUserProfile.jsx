define([
    'underscore',
    'react',
    'react-dom'
], function(_, React, ReactDOM) {
    return React.createClass({
        componentDidMount: function() {
        },
        handleUpdate: function() {
            var self = this;
            var firstName = ReactDOM.findDOMNode(this.refs.first_name).value;
            var lastName = ReactDOM.findDOMNode(this.refs.last_name).value;
            var email = ReactDOM.findDOMNode(this.refs.email).value;
            var phone = ReactDOM.findDOMNode(this.refs.phone).value;
            if(phone && phone != "") {
                if (!phone.match(/\+[0-9]{1,3}\([0-9]{3}\)[0-9]{3}-[0-9]{4}/g)) {
                    $("#phone").addClass("invalid");
                    return;
                }
            }

            $.ajax({
                url:"/api/users/"+window.currentUser.id,
                method: "PUT",
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phone
                },
                success : function(response) {
                    window.currentUser.firstName = firstName
                    window.currentUser.lastName = lastName
                    window.currentUser.email = email
                    window.currentUser.phoneNumber = phone
                    self.props.onCloseEditModal();
                }
            })
        },
        onPhoneChange: function() {
            $("#phone").removeClass("invalid");
        },
        render: function() {
            return (
                <div id="modalEditUser" className="modal edit-user">
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
                                <input ref="phone" id="phone" type="tel" className="validate" defaultValue={window.currentUser.phoneNumber} onChange={this.onPhoneChange}/>
                                <label data-error="Invalid format, please use +x(xxx)xxx-xxxx" className="active" htmlFor="phone">Phone</label>
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


















