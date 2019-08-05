import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./Loading.module.scss";
import { connect } from "react-redux";

const cx = classNames.bind(styles);

class Loading extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { loading } = nextProps;
    if (loading !== this.props.loading) {
      return true;
    }
    return false;
  }
  render() {
    const { loading } = this.props;
    if (!loading) return "";

    return (
      <div className={cx("loading-container")}>
        <div className={cx("spinner")} />
      </div>
    );
  }
}

export default connect(
  state => ({
    // loading: state.state.get("loading")
  }),
  null
)(Loading);
