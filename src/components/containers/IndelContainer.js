import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Indel from "components/Indel";

class IndelContainer extends Component {
  constructor(props) {
    super(props);
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
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { indel } = nextProps;
    if (indel !== this.props.indel) {
      const len = indel.seq.split("");
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
              data: indel.indel
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

export default connect(
  state => ({
    indel: state.analysis.get("indel").toJS()
  }),
  null
)(IndelContainer);
