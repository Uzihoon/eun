import React from "react";
import styles from "./Indel.module.scss";
import classNames from "classnames/bind";
import { Line } from "react-chartjs-2";

const cx = classNames.bind(styles);

const Indel = ({ data }) => {
  console.log(data);
  return (
    <div>
      <Line data={data} options={{}} />
    </div>
  );
};

export default Indel;
