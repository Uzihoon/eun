import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/Upload";
import WorkerComponent from "components/WebWorker";

import * as uploadActions from "store/modules/upload";

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
        onChange(info) {
          const { file, fileList } = info;
          if (file.status !== "uploading") {
            UploadActions.handleFileList(file);
          }
          if (file.status === "done") {
          }
        }
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { format } = nextProps;
    if (format && !format.equals(this.props.format)) {
      const data = format.toJS() || {};
      this.worker.postMessage(data);
    }

    return true;
  }

  componentDidMount() {
    this.worker = new Worker("./worker.js");
  }

  wrappedComponentRef = ref => {
    this.uploadForm = ref;
  };

  formatData = data => {};

  handleSubmit = _ => {
    const { UploadActions, fileList } = this.props;
    const form = this.uploadForm.props.form;
    const files = fileList.toJS();
    form.validateFields((err, val) => {
      if (err) return;
      const evenFile = files.length % 2;
      // TODO: 파일은 짝수여야 한다고 경고 메세지 띄우기
      if (evenFile > 0) return;
      val.files = files;
      UploadActions.formatData(val);
    });
  };

  handleData = data => {
    console.log(data);
  };

  render() {
    return (
      <>
        <Upload {...this.state} {...this} {...this.props} />
        {this.worker && (
          <WorkerComponent worker={this.worker} handleData={this.handleData} />
        )}
      </>
    );
  }
}

export default connect(
  state => ({
    nucleaseTypeList: state.upload.get("nucleaseTypeList").toJS(),
    nucleaseList: state.upload.get("nucleaseList").toJS(),
    format: state.upload.get("format"),
    fileList: state.upload.get("fileList")
  }),
  dispatch => ({
    UploadActions: bindActionCreators(uploadActions, dispatch)
  })
)(UploadContainer);
