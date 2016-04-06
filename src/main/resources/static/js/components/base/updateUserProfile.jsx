window.UserEditor = React.createClass({
    getInitialState : function() {
        console.log(this.props);
        return {};
    },
    handleUpdate: function() {
        var params = {
            firstName : ReactDOM.findDOMNode(this.refs.first_name).value,
            lastName : ReactDOM.findDOMNode(this.refs.last_name).value,
            telephone : ReactDOM.findDOMNode(this.refs.phone).value,
            email : ReactDOM.findDOMNode(this.refs.email).value,
        };
        var self = this;
        $.ajax({
            url : '/api/user/'+this.props.user.id,
            method: 'PUT',
            data : params,
            success : function(response) {
                // window.location.href = '/#modalLogin'
                window.location.reload()
            }
        });
    },
    close : function() {
        this.props.onClose();
    },
    render: function() {
        return (
            <div className="edit-userr">
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
                            <input ref="first_name" id="first_name" type="text" className="validate" defaultValue={this.props.user.firstName}/>
                            <label className="active" htmlFor="first_name">First Name</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <input ref="last_name" id="last_name" type="text" className="validate" defaultValue={this.props.user.lastName}/>
                            <label className="active" htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="email" id="email" type="email" className="validate" defaultValue={this.props.user.email}/>
                            <label className="active" htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input ref="phone" id="phone" type="tel" className="validate" defaultValue={this.props.user.telephone}/>
                            <label className="active" htmlFor="phone">Phone</label>
                        </div>
                    </div>
                    <button onClick={this.handleUpdate} className="btn waves-effect waves-light button-right"
                            id='login' type="submit" name="action">
                        <span>Submit</span>
                        <i className="material-icons right">send</i>
                    </button>

                </div>
                <div id="modalUpdate" className="modal">
                    <UserEditor onClose={this.closeUserEditor} customer={window.user}/>
                </div>

            </div>


        )



    }
});