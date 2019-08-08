import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/Upload";
import WebWorker from "worker/Webworker";
import worker from "worker/worker";

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
            UploadActions.handleFileList(fileList);
          }
          if (file.status === "done") {
          }
        }
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { format } = nextProps;
    if(format && !format.equals(this.props.format)) {
      console.log(format.toJS());
    }

    return true;
  }

  componentDidMount() {
    this.worker = new WebWorker(worker);
    this.worker.onmessage = msg => {
      console.log(msg);
    }
  }

  wrappedComponentRef = ref => {
    this.uploadForm = ref;
  };

  formatData = data => {

  }

  handleSubmit = _ => {
    const { UploadActions } = this.props;
    const form = this.uploadForm.props.form;
    form.validateFields((err, val) => {
      if (err) return;
      // console.log(this.worker);
      // this.worker.postMessage(val);
      UploadActions.formatData(val);
    });
  };

  render() {
    return <Upload {...this.state} {...this} {...this.props} />;
  }
}

export default connect(
  state => ({
    nucleaseTypeList: state.upload.get("nucleaseTypeList").toJS(),
    nucleaseList: state.upload.get("nucleaseList").toJS(),
    format: state.upload.get("format")
  }),
  dispatch => ({
    UploadActions: bindActionCreators(uploadActions, dispatch)
  })
)(UploadContainer);
