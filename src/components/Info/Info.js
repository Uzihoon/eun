import React from "react";
import styles from "./Info.module.scss";
import classNames from "classnames/bind";
import { Modal } from "antd";
import range from "img/range.png";

const cx = classNames.bind(styles);

function Info({ visible, onCancel }) {
  return (
    <Modal visible={visible} footer={null} onCancel={onCancel} width="70%">
      <div className={cx("title")}>How to use Cas Analysis</div>
      <div className={cx("content", "example")}>
        <span className={cx("head")}>Example gz file: </span>
        <span className={cx("text")}>
          <b className={cx("red")}>Sample-ID-</b>73_S73
          <b className={cx("green")}>_L001_</b>R1_001.gz
        </span>
      </div>
      <div className={cx("content")}>
        <span className={cx("head")}>
          <b className={cx("red")}>File name pattern (Optional)</b>
        </span>
        <span className={cx("text")}>
          recognizes the name (number) of file.
        </span>
      </div>
      <div className={cx("content")}>
        <span className={cx("head")}>
          <b className={cx("green")}>File Index pattern</b>
        </span>
        <span className={cx("text")}>
          designates paired-end reads (R1 and R2) of gz file.
        </span>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Sequencing Data (Paired-end reads)</b>
        </div>
        <div className={cx("bottom")}>
          Please upload NGS data file (.gz or .fastaq file).
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Reference Amplicon Sequence</b>
        </div>
        <div className={cx("bottom")}>
          Please enter the amplified sequence of target locus.
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Used Cas Ortholog</b>
        </div>
        <div className={cx("bottom")}>
          Please choose the Cas ortholog you used.
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Target DNA sequence</b>
        </div>
        <div className={cx("bottom")}>
          Please fill the target sequence (5’ to 3’) without PAM sequence
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Standard Range</b>
        </div>
        <div className={cx("img")}>
          <img src={range} />
        </div>
        <div className={cx("bottom")}>
          Sequence is analyzed in the range of 70 nucleotides on the both sides
          from cleavage site. (Default value is 70)
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Target nucleotide</b>
        </div>
        <div className={cx("bottom")}>
          Please enter the target nucleotide with use of base editors (CBE
          variants or ABE variants).
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("top")}>
          <b>Desired change of target nucleotide</b>
        </div>
        <div className={cx("bottom")}>
          Please enter the desired nucleotide with use of base editors.
        </div>
      </div>
      <div className={cx("add-block")}>
        <div className={cx("add")}>
          After running Cas Analysis, we provide <b>.json</b> file and you can
          easily reaccess your data with <b>Analyze by json file</b> at the top
          of <b>Cas Analysis</b> page.
        </div>
        <div className={cx("add")}>
          If you need the sample run data, please click the{" "}
          <b>Run analyze sample file</b> at the top of <b>Cas Analysis</b> page.
        </div>
      </div>
      <div className={cx("add-block")}>
        <div className={cx("add")}>
          If you have any other questions or want to add new features, please
          feel free to contact to <b>uzihoon.dev@gmail.com</b>.
        </div>
      </div>
    </Modal>
  );
}

export default Info;
