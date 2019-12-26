import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, HashRouter, Redirect } from "react-router-dom";
import {
  UploadPage,
  LoginPage,
  AnalysisPage,
  SignupPage,
  ListPage,
  IndelReportPage,
  MainPage,
  IndelPage,
  ConvertPage,
  VersionPage
} from "pages";
import PrivateRouter from "lib/PrivateRouter";
import InfoMessage from "components/common/InfoMessage";
import Intro from "components/common/Intro";
import { withRouter } from "react-router";
import * as stateActions from "store/modules/state";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localAuthed: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { authed } = nextProps;
    const { localAuthed } = nextState;

    if (this.props.authed !== authed && localAuthed !== authed) {
      this.setState({ localAuthed: authed });
    }

    if (this.state !== nextState) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    const { StateActions, history, authed, location } = this.props;
    if (!authed) {
      StateActions.checkAuth({ location, history });
    }
  }

  render() {
    const { localAuthed: authed } = this.state;
    return (
      <>
        <HashRouter>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <PrivateRouter
              path="/"
              component={MainPage}
              exact
              authed={authed}
            />
            <PrivateRouter
              path="/analysis"
              component={UploadPage}
              authed={authed}
              exact
            />
            <PrivateRouter
              path="/analysis/:analysisId"
              component={AnalysisPage}
              authed={authed}
            />
            {/* <PrivateRouter
              path="/daeunyoon"
              component={HiddenPage}
              authed={authed}
            /> */}
            <PrivateRouter
              path="/indel"
              component={IndelReportPage}
              authed={authed}
              exact
            />
            <PrivateRouter
              path="/indel/:indelId"
              component={IndelPage}
              authed={authed}
            />
            <PrivateRouter
              path="/convert"
              component={ConvertPage}
              authed={authed}
            />
            <PrivateRouter
              path="/version"
              component={VersionPage}
              authed={authed}
            />
            <PrivateRouter path="/list" component={ListPage} authed={authed} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
        <InfoMessage />
        {/* <Intro /> */}
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
