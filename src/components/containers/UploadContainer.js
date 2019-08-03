import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/common/Upload";
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

  render() {
    return <Upload {...this.state} />;
  }
}

export default connect(
  null,
  dispatch => ({
    UploadActions: bindActionCreators(uploadActions, dispatch)
  })
)(UploadContainer);
