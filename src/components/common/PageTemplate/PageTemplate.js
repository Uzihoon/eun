import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./PageTemplate.module.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";
import * as stateActions from "store/modules/state";

const { Header, Content } = Layout;

const cx = classNames.bind(styles);

class PageTemplate extends Component {
  pushUpload = _ => {
    const { history } = this.props;
    history.push("/upload");
  };

  handleLogout = async _ => {
    const { StateActions, history } = this.props;
    await Auth.signOut();
    StateActions.logout();
    history.push("/login");
  };

  render() {
    const { children } = this.props;
    return (
      <Layout className={cx("full-layout")}>
        <Header className="header" style={{ padding: " 0 24px" }}>
          <div className={cx("header-box")}>
            <div className={cx("logo")} onClick={this.pushUpload}>
              EUN
            </div>
            <div className={cx("logout")} onClick={this.handleLogout}>
              Logout
            </div>
          </div>
        </Header>
        <Layout>
          <Layout style={{ padding: "24px" }}>
            <Content
              style={{
                background: "#fff",
                padding: 24,
                margin: 0,
                minHeight: 280
              }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    null,
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(PageTemplate)
);
