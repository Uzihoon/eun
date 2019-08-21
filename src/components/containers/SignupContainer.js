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
      confirm: false,
      confirmDirty: false,
      newUser: null,
      loading: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const form = this.signupForm.props.form;
    form.validateFields(async (err, val) => {
      if (err) return;
      console.log("?");
      this.setState({ loading: true });
      try {
        const { username, password } = val;
        const newUser = await Auth.signUp({ username, password });
        this.setState({ newUser, username, password, confirm: true });
        console.log(newUser);
      } catch (error) {
        this.handleError(error);
      }
      this.setState({ loading: false });
    });
  };

  handleConfirmation = e => {
    e.preventDefault();
    const { StateActions, history } = this.props;
    const { username, password, newUser } = this.state;
    const form = this.signupForm.props.form;
    form.validateFields(async (err, val) => {
      if (err) return;
      this.setState({ loading: true });
      const { code } = val;
      try {
        await Auth.confirmSignUp(username, code);
        await Auth.signIn(username, password);
        StateActions.loginSuccess(newUser);
        history.push("/upload");
      } catch (error) {
        this.handleError(error);
      }
      this.setState({ loading: false });
    });
  };

  handleError = err => {
    const msg = err.message || err;
    const { StateActions } = this.props;
    StateActions.showMsg({
      status: "warning",
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

  render() {
    return <Signup {...this.state} {...this} />;
  }
}

export default withRouter(
  connect(
    null,
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(SignupContainer)
);
