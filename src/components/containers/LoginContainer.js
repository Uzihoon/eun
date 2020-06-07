import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "components/Login";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import * as stateActions from "store/modules/state";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = _ => {
    const { StateActions, history } = this.props;
    const form = this.loginForm.props.form;

    form.validateFields((err, val) => {
      if (err) return;
      StateActions.login({ val, history });
    });
  };

  handleRegister = _ => {
    const { history } = this.props;
    history.push("/signup");
  };

  handleGuest = () => {
    const { StateActions } = this.props;
    StateActions.loginSuccess({ email: "Guest@" });
  };

  componentDidMount() {
    const { enterEvent } = this;
    window.addEventListener("keydown", enterEvent);
  }

  componentWillUnmount() {
    const { enterEvent } = this;
    window.removeEventListener("keydown", enterEvent);
  }

  enterEvent = e => {
    if (e.keyCode === 13) {
      e.preventDefault();

      this.handleSubmit();
    }
  };

  wrappedComponentRef = ref => {
    this.loginForm = ref;
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.authed !== nextProps.authed) return true;
    return false;
  }

  render() {
    const { authed } = this.props;
    if (authed) return <Redirect to="/analysis" />;
    return <Login {...this} {...this.state} />;
  }
}

export default withRouter(
  connect(
    state => ({
      authed: state.state.get("authed")
    }),
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(LoginContainer)
);
