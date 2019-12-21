import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./PageTemplate.module.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";
import TopBar from "components/common/TopBar";

import * as stateActions from "store/modules/state";
import * as uploadActions from "store/modules/upload";
import * as analysisActions from "store/modules/analysis";

const { Content } = Layout;

const cx = classNames.bind(styles);

class PageTemplate extends Component {
  pushPage = url => {
    const { history } = this.props;
    history.push(url);
  };

  handleLogout = _ => {
    const { StateActions, history } = this.props;
    StateActions.logout(history);
  };

  runSample = _ => {
    // run sample
    const { sampleLoading, history, AnalysisActions } = this.props;
    const path = history.location.pathname;
    if (sampleLoading) return false;
    AnalysisActions.runSample();
  };

  render() {
    const { children, nolayout } = this.props;
    return (
      <Layout className={cx("full-layout")}>
        <TopBar {...this.props} {...this} />
        <Layout>
          {nolayout ? (
            children
          ) : (
            <Layout style={{ padding: "24px 0", width: "85%", margin: "auto" }}>
              <Content
                style={{
                  background: "#fff",
                  padding: 24,
                  margin: "auto",
                  width: "100%",
                  minHeight: 280,
                  maxWidth: 1300
                }}
              >
                {children}
              </Content>
              <a className={cx("footer")} href="https://github.com/Uzihoon">
                Uzihoon @2019
              </a>
            </Layout>
          )}
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      sampleLoading: state.state.get("sampleLoading"),
      menuList: state.state.get("menuList")
    }),
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch),
      UploadActions: bindActionCreators(uploadActions, dispatch),
      AnalysisActions: bindActionCreators(analysisActions, dispatch)
    })
  )(PageTemplate)
);
