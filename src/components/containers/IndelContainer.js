import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Indel from "components/Indel"

class IndelContainer extends Component {

  render() {
    return (
      <Indel {...this.props} {...this} {...this.state}/>
    )
  }
}

export default IndelContainer;