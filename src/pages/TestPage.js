import React from "react";
import WebWorker from "react-webworker";

export default () => {
  return (
    <WebWorker url="./test.js">
      {({ data, error, postMessage }) => {
        if (data) {
          return <div>{JSON.stringify(data)}</div>;
        }
        return <button onClick={() => postMessage("hello")}>hello</button>;
      }}
    </WebWorker>
  );
};
