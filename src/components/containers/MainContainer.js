import React, { useState, useEffect } from "react";
import Main from "components/Main";
import Line from "img/line.png";
import Dna from "img/dna.png";
import { withRouter } from "react-router";

const MainContainer = props => {
  // state
  const [state, setState] = useState({
    menu: [
      {
        title: "Cas Analysis",
        url: "/upload",
        icon: Dna
      },
      {
        title: "INDEL Type Report",
        url: "/indel",
        icon: Line
      }
    ]
  });

  // lifecycle

  // componentDidMount
  useEffect(() => {
    console.log("Hello");
  }, []);

  const clickToLink = url => {
    props.history.push(url);
  };

  return <Main {...props} {...state} clickToLink={clickToLink} />;
};

export default withRouter(MainContainer);
