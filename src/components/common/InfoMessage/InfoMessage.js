import React, { Component } from "react";
import { connect } from "react-redux";
import { message } from "antd";
import { bindActionCreators } from "redux";
import * as stateActions from "store/modules/state";

class InfoMessage extends Component {
  handleMessage = ({ status, content }) => {
    const { StateActions } = this.props;
    message[status](content);
    StateActions.hideMsg();
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { msg } = nextProps;
    if (msg.show !== this.props.msg.show && msg.show) {
      this.handleMessage(msg);
      return true;
    }
    return false;
  }

  render() {
    return "";
  }
}

export default connect(
  state => ({
    msg: state.state.get("msg")
  }),
  dispatch => ({
    StateActions: bindActionCreators(stateActions, dispatch)
  })
)(InfoMessage);
