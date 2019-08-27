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
import PrivateRouter from "lib/PrivateRouter";
import InfoMessage from "components/common/InfoMessage";
import { Auth } from "aws-amplify";
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

  async componentDidMount() {
    const { StateActions, history, authed, location } = this.props;
    if (!authed) {
      try {
        const data = await Auth.currentSession();
        StateActions.loginSuccess(data.idToken.payload);
        const prevLocation = location.hash;
        history.push(prevLocation);
        this.setState({ localAuthed: true });
      } catch (error) {
        if (error !== "No current user") {
          StateActions.showMsg({
            status: "warning",
            content: error
          });
        }
      }
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
            <PrivateRouter path="/list" component={ListPage} authed={authed} />
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
