import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/Upload";
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

  wrappedComponentRef = ref => {
    this.uploadForm = ref;
  };

  handleSubmit = _ => {
    const form = this.uploadForm.props.form;
    form.validateFields((err, val) => {
      if (err) return;
      console.log(val);
    });
  };

  render() {
    return <Upload {...this.state} {...this} {...this.props} />;
  }
}

export default connect(
  state => ({
    nucleaseTypeList: state.upload.get("nucleaseTypeList").toJS(),
    nucleaseList: state.upload.get("nucleaseList").toJS()
  }),
  dispatch => ({
    UploadActions: bindActionCreators(uploadActions, dispatch)
  })
)(UploadContainer);
