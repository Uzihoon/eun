import React, { useState } from "react";
import Convert from "components/Convert";

const ConvertContainer = props => {
  const fileList = [];

  const [state, setState] = useState({
    uploadInfo: {
      name: "json",
      accept: "application/json, .json",
      beforeUpload: file => {
        const hasFile = getFileIndex(file);
        if (hasFile < 0) {
          readFile(file);
        }
        return false;
      },
      multiple: true,
      onRemove: file => {
        const index = getFileIndex(file);
        if (index >= 0) {
          fileList.splice(index, 1);
        }
        return true;
      }
    }
  });

  const readFile = file => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = event => setFileList(event, file);
  };

  const setFileList = (event, file) => {
    const value = JSON.parse(event.target.result);
    const key = file.name.replace(".json", "").replace("_", " ");
    fileList.push({ key, value });
  };

  const getFileIndex = file => {
    return fileList.findIndex(e => {
      const key = e.key || "";
      const name = key.replace(" ", "_") + ".json";
      return name === file.name;
    });
  };

  return <Convert {...state} />;
};

export default ConvertContainer;
