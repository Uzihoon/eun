import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Indel from "components/Indel";
import { withRouter } from "react-router";

class IndelContainer extends Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      data: {
        labels: [],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "transparent",
            borderColor: "rgb(255, 99, 132)",
            data: []
          }
        ]
      },
      indelId: match.params.indelId
    };
  }

  componentWillMount() {
    const { indel, history } = this.props;
    const { indelId } = this.state;
    if (!indelId || !indel[indelId]) {
      history.push("/indel");
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { indelId } = nextState;
    const { indel } = nextProps;
    const nextIndel = indel[indelId];
    const prevIndel = this.props.indel[indelId];
    if (nextIndel !== prevIndel) {
      const len = nextIndel.seq.split("");
      const labels = [];
      for (let i = 1; i <= len.length; i++) {
        labels.push(i);
      }
      this.setState({
        data: {
          labels,
          datasets: [
            {
              ...this.state.data.datasets[0],
              data: nextIndel.indel
            }
          ]
        }
      });
    }

    return true;
  }

  render() {
    return <Indel {...this.props} {...this} {...this.state} />;
  }
}

export default withRouter(
  connect(
    state => ({
      indel: state.indel.get("indel").toJS()
    }),
    null
  )(IndelContainer)
);
