import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/Upload";
import WorkerComponent from "components/WebWorker";
import Loading from "components/common/Loading";
import { withRouter } from "react-router";

import * as uploadActions from "store/modules/upload";
import * as analysisActions from "store/modules/analysis";
import * as stateActions from "store/modules/state";

class UploadContainer extends Component {
  constructor(props) {
    super(props);
    const { UploadActions } = props;
    this.state = {
      uploadInfo: {
        name: "gz",
        aceept: "application/gzip, .gz",
        beforeUpload: (file, fileList) => false,
        multiple: true,
        onRemove(file) {
          UploadActions.deleteFileList(file);
          return true;
        },
        onChange: info => {
          const { fileList } = this.props;
          const { file } = info;
          if (file.status !== "uploading") {
            const list = fileList ? fileList.toJS() : [];
            const hasFile = list.findIndex(e => e.name === file.name);
            if (hasFile < 0) {
              UploadActions.handleFileList(file);
            }
          }
          if (file.status === "done") {
          }
        }
      },
      loading: false,
      title: "",
      gauge: 0,
      workerNum: 0,
      postWorker: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { format, StateActions, AnalysisActions, history } = nextProps;
    const { handleData } = this;
    if (format && !format.equals(this.props.format)) {
      const data = format.toJS() || {};
      const { fileList } = data;
      const failList = [];
      let workerNum = 0;
      let worker;

      for (let i in fileList) {
        const files = fileList[i].sort((a, b) =>
          ("" + a.name).localeCompare(b.name)
        );
        if (files.length < 2) {
          failList.push(i);
        } else {
          data.files = files;
          data.fileId = i;
          worker = new Worker("./worker.js");
          worker.postMessage(data);
          worker.onmessage = function(e) {
            handleData(e.data);
          };
          ++workerNum;
        }
      }
      if (failList.length === Object.keys(fileList)) {
        StateActions.showMsg({
          status: "warning",
          content: "Please check file again!"
        });
      } else {
        AnalysisActions.saveAnalysis({ type: "failList", data: failList });
        this.setState({
          loading: true,
          title: "Analyzing",
          workerNum
        });
      }
    }

    if (this.state.postWorker !== nextState.postWorker) {
      if (nextState.postWorker === this.state.workerNum) {
        this.setState({ loading: false });
        history.push("/analysis");
      }
    }

    if (this.state.loading !== nextState.loading) {
      return true;
    }

    if (this.state.gauge !== nextState.gauge) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.worker = new Worker("./worker.js");
  }

  wrappedComponentRef = ref => {
    this.uploadForm = ref;
  };

  formatData = data => {};

  handleSubmit = _ => {
    const { UploadActions, fileList, StateActions } = this.props;
    const form = this.uploadForm.props.form;
    const files = fileList.toJS();
    form.validateFields((err, val) => {
      if (err) return;
      const evenFile = files.length % 2;
      // TODO: 파일은 짝수여야 한다고 경고 메세지 띄우기
      if (evenFile > 0) {
        StateActions.showMsg({
          status: "warning",
          content: "Please check file again!"
        });
        return;
      }
      val.files = files;
      UploadActions.formatData(val);
    });
  };

  handleData = data => {
    const { AnalysisActions } = this.props;
    let { postWorker } = this.state;
    if (data.msgType === 2) {
      this.setState({
        gauge: data.msg
      });
    } else {
      if (data.msgType === 0) {
        AnalysisActions.saveAnalysis({ type: "summary", data: data.msg });
      }
      if (data.msgType === 4) {
        const fileId = data.msg.fileId;
        AnalysisActions.analysised({ fileId, data: data.msg });
        this.setState({ postWorker: ++postWorker });
      }
    }
  };

  validationCheck = (rule, value, callback) => {
    const char = value.toUpperCase();
    const sequence = ["A", "C", "G", "T"];
    console.log(rule);
    if (!sequence.includes(char)) {
      callback("Please check sequence");
    }
    callback(value);
    return true;
  };

  render() {
    const { loading, title, gauge } = this.state;
    return (
      <>
        <Upload {...this.state} {...this} {...this.props} />
        {this.worker && (
          <WorkerComponent worker={this.worker} handleData={this.handleData} />
        )}
        {loading && <Loading title={title} gauge={gauge} />}
      </>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      nucleaseTypeList: state.upload.get("nucleaseTypeList").toJS(),
      nucleaseList: state.upload.get("nucleaseList").toJS(),
      format: state.upload.get("format"),
      fileList: state.upload.get("fileList")
    }),
    dispatch => ({
      UploadActions: bindActionCreators(uploadActions, dispatch),
      AnalysisActions: bindActionCreators(analysisActions, dispatch),
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(UploadContainer)
);
