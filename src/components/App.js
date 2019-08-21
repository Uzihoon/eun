import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, HashRouter, Redirect } from "react-router-dom";
import {
  UploadPage,
  LoginPage,
  AnalysisPage,
  SignupPage,
  ListPage
} from "pages";
import TestPage from "pages/TestPage";
import PrivateRouter from "lib/PrivateRouter";
import InfoMessage from "components/common/InfoMessage";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router";
import * as stateActions from "store/modules/state";

class App extends Component {
  async componentDidMount() {
    const { StateActions, history } = this.props;
    try {
      const data = await Auth.currentSession();
      StateActions.loginSuccess(data.idToken.payload);
      history.push("#upload");
    } catch (error) {
      if (error !== "No current user") {
        StateActions.showMsg({
          status: "warning",
          content: error
        });
      }
    }
  }
  render() {
    const { authed } = this.props;
    return (
      <>
        <HashRouter>
          <Switch>
            <Route path="/login" component={LoginPage} exact />
            <Route path="/signup" component={SignupPage} exact />
            {/*<PrivateRouter
              path="/list"
              component={ListPage}
              authed={authed}
            />*/}
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
            <Redirect to="/upload" />
          </Switch>
        </HashRouter>
        <InfoMessage />
      </>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      authed: state.state.get("authed")
    }),
    dispatch => ({
      StateActions: bindActionCreators(stateActions, dispatch)
    })
  )(App)
);
