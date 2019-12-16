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

  componentDidMount() {
    const { indelId } = this.state;
    const { indel } = this.props;
    if (indel[indelId]) {
      this.handleDataset(indel[indelId]);
    }
  }

  handleDataset = indelData => {
    const len = indelData.seq.split("");
    const labels = len;

    const datasets = indelData.result.map(data => ({
      ...this.state.data.datasets[0],
      data: data.indel,
      label: data.label
    }));
    console.log(datasets);
    this.setState({ data: { labels, datasets } });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { indelId } = nextState;
    const { indel } = nextProps;
    const nextIndel = indel[indelId];
    const prevIndel = this.props.indel[indelId];
    if (nextIndel !== prevIndel && nextIndel) {
      this.handleDataset(nextIndel);
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
