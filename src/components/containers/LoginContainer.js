import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "components/Login";
import { withRouter } from "react-router";
import * as stateActions from "store/modules/state";
import { Auth } from "aws-amplify";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false
    };
  }

  handleSubmit = _ => {
    const { StateActions, history } = this.props;
    const form = this.loginForm.props.form;

    form.validateFields(async (err, val) => {
      if (err) return;
      this.setState({ pending: true });

      try {
        const { email, password } = val;
        const data = await Auth.signIn(email, password);
        this.setState({ pending: false });
        StateActions.loginSuccess(data);
        history.push("/upload");
      } catch (error) {
        const msg = error.message || error;
        console.log(error);
        StateActions.showMsg({
          status: "error",
          content: msg
        });
        if (error.code === "UserNotConfirmedException") {
          StateActions.handleConfirm();
          StateActions.setTempUsername(val.email);
          history.push("/signup");
        } else {
          this.setState({ pending: false });
        }
      }
    });
  };

  handleRegister = _ => {
    const { history } = this.props;
    history.push("/signup");
  };

  componentDidMount() {
    const { authed, history } = this.props;
    if (authed) history.push("/upload");
  }

  wrappedComponentRef = ref => {
    this.loginForm = ref;
  };

  render() {
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
