import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Upload from "components/common/Upload";
import { postFile } from "lib/api";

class UploadContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadInfo: {
        name: "gz",
        aceept: "application/gzip, .gz",
        multiple: true,
        action: postFile,
        onChange(info) {
          const { status } = info.file;
          if (status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (status === "done") {
            console.log("a");
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
  null
)(UploadContainer);
