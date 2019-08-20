import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "components/Login";
import { withRouter } from "react-router";
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

  handleUpload = () => {
    const { history, StateActions } = this.props;
    StateActions.loginSuccess();
    history.push("/upload");
  };

  render() {
    return (
      <Login
        handleSubmit={this.handleSubmit}
        handleRegister={this.handleRegister}
        handleChagne={this.handleChagne}
        handleUpload={this.handleUpload}
      />
    );
  }
}

export default withRouter(
  connect(
    null,
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(LoginContainer)
);
