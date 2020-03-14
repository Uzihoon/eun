import React, { useState, useEffect } from "react";
import styles from "./Question.module.scss";
import classNames from "classnames/bind";
import question from "img/question.png";
import Info from "components/Info";

const cx = classNames.bind(styles);

function Question() {
  const [showText, setShowText] = useState("");
  const [visible, setVisible] = useState(false);

  const handleModal = () => {
    setVisible(!visible);
  };

  const show = () => {
    setShowText("show");
  };

  const hidden = () => {
    setShowText("hidden");

    setTimeout(() => {
      show();
    }, 8000);
  };

  useEffect(() => {
    setTimeout(() => {
      show();
    }, 5000);
  }, []);

  return (
    <div className={cx("question-icon")} onClick={handleModal}>
      <img src={question} />
      <div className={cx("speech-bubble", showText)}>
        <div className={cx("text")}>May I help you?</div>
      </div>
      <Info visible={visible} onCancel={handleModal} />
    </div>
  );
}

export default Question;
