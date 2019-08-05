import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "components/Login";
import axios from "axios";

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
    axios
      .post("/api/auth/login", { email, password })
      .then(res => console.log(res))
      .catch(error => console.log(error));
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

export default LoginContainer;
