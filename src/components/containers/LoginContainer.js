import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "components/Login";
import * as stateActions from "store/modules/state";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChagne = (type, e) => {
    this.setState({
      [type]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { StateActions } = this.props;
    if (!email || !password) return;
    StateActions.tryLogin({ email, password });
  };

  handleRegister = e => {
    e.preventDefault();
    console.log(e);
  };

  render() {
    return (
      <Login
        handleSubmit={this.handleSubmit}
        handleRegister={this.handleRegister}
        handleChagne={this.handleChagne}
      />
    );
  }
}

export default connect(
  null,
  dispatch => ({
    StateActions: bindActionCreators(stateActions, dispatch)
  })
)(LoginContainer);
