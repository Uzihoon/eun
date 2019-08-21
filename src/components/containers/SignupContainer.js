import React, { Component } from "react";
import Signup from "components/Signup";
import { Auth } from "aws-amplify";
import * as stateActions from "store/modules/state";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";

class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      newUser: null,
      refreshed: false
    };
  }

  componentDidMount() {
    const { confirm, tempUsername } = this.props;
    if (confirm && tempUsername) {
      this.setState({
        username: tempUsername,
        refreshed: true
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { StateActions } = this.props;
    const form = this.signupForm.props.form;
    form.validateFields(async (err, val) => {
      if (err) return;
      try {
        const { username, password } = val;
        const newUser = await Auth.signUp({ username, password });
        this.setState({ newUser, username, password });
        StateActions.handleConfirm();
      } catch (error) {
        if (error.code === "UsernameExistsException") {
          const { username } = val;
          this.setState({
            refreshed: true,
            username
          });
          StateActions.handleConfirm();
        }
        this.handleError(error);
      }
    });
  };

  handleConfirmation = e => {
    e.preventDefault();
    const { StateActions, history } = this.props;
    const { username, password, newUser, refreshed } = this.state;
    const form = this.signupForm.props.form;
    form.validateFields(async (err, val) => {
      if (err) return;
      const { code } = val;
      try {
        await Auth.confirmSignUp(username, code);
        if (refreshed) {
          history.push("/login");
          StateActions.showMsg({
            status: "success",
            content: "Sign up successfully"
          });
        } else {
          await Auth.signIn(username, password);
          StateActions.loginSuccess(newUser);
          history.push("/upload");
        }
      } catch (error) {
        this.handleError(error);
        if (error.code === "NotAuthorizedException") {
          history.push("/login");
        }
      }
    });
  };

  handleError = err => {
    const msg = err.message || err;
    const { StateActions } = this.props;
    StateActions.showMsg({
      status: "error",
      content: msg
    });
  };

  wrappedComponentRef = ref => {
    this.signupForm = ref;
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.signupForm.props;
    let msg = undefined;
    if (value && value !== form.getFieldValue("password")) {
      msg = "Two passwords that you enter is inconsistent!";
    }
    callback(msg);
  };
  validateToNextPassword = (rule, value, callback) => {
    // 특수문자, 대문자, 숫자, 최소 6자리 이상이어야 한다.
    const regex = new RegExp(
      "(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%&*?]).{6,}"
    );
    const match = value.match(regex);
    let msg = undefined;
    if (!match) {
      msg = "Password must have uppercase and numeric and special characters ";
    }
    callback(msg);
  };

  pushToLogin = _ => {
    const { history } = this.props;
    history.push("/login");
  };

  render() {
    return <Signup {...this.state} {...this} {...this.props} />;
  }
}

export default withRouter(
  connect(
    state => ({
      confirm: state.state.get("confirm"),
      tempUsername: state.state.get("tempUsername")
    }),
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(SignupContainer)
);
