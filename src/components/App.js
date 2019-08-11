import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, HashRouter, Redirect } from "react-router-dom";
import { UploadPage, LoginPage, AnalysisPage } from "pages";
import TestPage from "pages/TestPage";
import PrivateRouter from "lib/PrivateRouter";

class App extends Component {
  render() {
    const { authed } = this.props;
    return (
      <>
        <HashRouter>
          <Switch>
            <Route path="/login" component={LoginPage} exact />
            <PrivateRouter
              path="/upload"
              component={UploadPage}
              authed={authed}
            />
            <PrivateRouter
              path="/analysis"
              component={AnalysisPage}
              authed={authed}
            />
            <PrivateRouter path="/test" component={TestPage} authed={authed} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
      </>
    );
  }
}

export default connect(
  state => ({
    authed: state.state.get("authed")
  }),
  null
)(App);
