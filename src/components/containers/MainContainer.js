import React, { useState, useEffect } from "react";
import Main from "components/Main";
import { withRouter } from "react-router";
import { connect } from "react-redux";

const MainContainer = props => {
  // state
  const [state, setState] = useState({});

  // lifecycle

  // componentDidMount
  useEffect(() => {}, []);

  const clickToLink = url => {
    props.history.push(url);
  };

  return <Main {...props} {...state} clickToLink={clickToLink} />;
};

export default withRouter(
  connect(
    state => ({
      menuList: state.state.get("menuList")
    }),
    null
  )(MainContainer)
);
