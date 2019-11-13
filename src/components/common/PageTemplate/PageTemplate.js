import React, { Component } from "react";
import classNames from "classnames/bind";
import styles from "./PageTemplate.module.scss";
import { Layout } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Auth } from "aws-amplify";

import * as stateActions from "store/modules/state";
import * as uploadActions from "store/modules/upload";

import Sample1 from "asset/Sample-ID-71_S71_L001_R1_001.fastq.gz";
import Sample2 from "asset/Sample-ID-71_S71_L001_R2_001.fastq.gz";
import Sample3 from "asset/Sample-ID-72_S72_L001_R1_001.fastq.gz";
import Sample4 from "asset/Sample-ID-72_S72_L001_R2_001.fastq.gz";

import axios from "axios";

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

  runSample = async _ => {
    // run sample
    const { UploadActions } = this.props;
    const fileURL = [
      { url: Sample1, name: "71_S71_L001_R1" },
      { url: Sample2, name: "71_S71_L001_R2" },
      { url: Sample3, name: "72_S72_L001_R1" },
      { url: Sample4, name: "72_S72_L001_R2" }
    ];

    const fileList = [];
    const promise = [];
    const header = { responseType: "blob" };
    fileURL.map(file => promise.push(axios.get(file.url, header)));

    await axios.all(promise).then(
      axios.spread((...args) => {
        args.map((result, index) => {
          const title = `Sample-ID-${fileURL[index].name}_001.fastq.gz`;
          const file = new File([result.data], title);
          fileList.push(file);
        });
      })
    );

    const sample = {
      changeSeq: "g",
      files: fileList,
      fullseq:
        "ACCTCTTATCTTCCTCCCACAGCTCCTGGGCAACGTGCTGGTCTGTGTGCTGGCCCATCACTTTGGCAAAGAATTCACCCCACCAGTGCAGGCTGCCTATCAGAAAGTGGTGGCTGGTGTGGCTAATGCCCTGGCCCACAAGTATCACTAAGCTCGCTTTCTTGCTGTCCAATTTCTATTAAAGGTTCCTTTGTTCCCTAAGTCCAACT",
      indexPattern: "_L001_",
      namePattern: "",
      nucleases: "1",
      nuctype: "0",
      rgenseq: "TCAGAAAGTGGTGGCTGGTG",
      targetSeq: "a"
    };

    UploadActions.formatData(sample);
  };

  render() {
    const { children, nolayout } = this.props;
    return (
      <Layout className={cx("full-layout")}>
        <Header className={cx("header")} style={{ padding: " 0 24px" }}>
          <div className={cx("header-box")}>
            <div className={cx("logo")} onClick={this.pushUpload}>
              EUN
            </div>

            <div className={cx("right-side")}>
              <div className={cx("run-sample")} onClick={this.runSample}>
                Run Sample
              </div>
              <div className={cx("logout")} onClick={this.handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </Header>
        <Layout>
          {nolayout ? (
            children
          ) : (
            <Layout style={{ padding: "24px" }}>
              <Content
                style={{
                  background: "#fff",
                  padding: 24,
                  margin: 0,
                  minHeight: 280
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
  connect(null, dispatch => ({
    StateActions: bindActionCreators(stateActions, dispatch),
    UploadActions: bindActionCreators(uploadActions, dispatch)
  }))(PageTemplate)
);
