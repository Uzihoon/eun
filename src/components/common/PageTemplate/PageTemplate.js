import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./PageTemplate.module.scss";
import { Layout, Menu, Breadcrumb } from "antd";
import { withRouter } from "react-router";

const { Header, Content } = Layout;

const cx = classNames.bind(styles);

class PageTemplate extends Component {
  pushUpload = _ => {
    const { history } = this.props;
    history.push("/upload");
  };

  render() {
    const { children } = this.props;
    return (
      <Layout className={cx("full-layout")}>
        <Header className="header" style={{ padding: " 0 24px" }}>
          <div className={cx("logo")} onClick={this.pushUpload}>
            EUN
          </div>
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu> */}
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

export default withRouter(PageTemplate);
