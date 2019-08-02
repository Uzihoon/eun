import React from "react";
import { Upload, Icon } from "antd";

const { Dragger } = Upload;

const UploadComponent = ({uploadInfo}) => {

  return (
    <Dragger {...uploadInfo}>
      <p><Icon type="inbox"/></p>
      <p>Click or drag file to this area to upload</p>
    </Dragger>
  )
}

export default UploadComponent;