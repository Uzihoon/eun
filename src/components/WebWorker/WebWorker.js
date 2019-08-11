import React from "react";
import WebWorker from "react-webworker";

const WorkerComponent = ({ worker, handleData }) => {
  return (
    <WebWorker worker={worker}>
      <WebWorker.Data>{data => handleData(data)}</WebWorker.Data>
    </WebWorker>
  );
};
export default WorkerComponent;
