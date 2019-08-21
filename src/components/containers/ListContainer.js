import React, { Component } from "react";
import List from "components/List";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class ListContainer extends Component {
  componentDidMount() {
    const { userInfo } = this.props;
    if(userInfo) {
      console.log(userInfo);
    }
  }
  render() {
    return <List {...this} {...this.state} {...this.props} />;
  }
}

export default connect(
  state => ({
    userInfo: state.state.get("userInfo").toJS()
  }),
  null
)(ListContainer);
