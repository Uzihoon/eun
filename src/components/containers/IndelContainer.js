import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Indel from "components/Indel";
import { withRouter } from "react-router";
import _ from "lodash";

class IndelContainer extends Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      chartType: "line",
      data: {
        datasets: []
      },
      indelId: match.params.indelId,
      options: {
        line: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                type: "linear",
                ticks: {
                  authSkip: true,
                  stepSize: 1,
                  min: 1
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          animation: { duration: 0 },
          elements: {
            line: {
              tension: 0.2
            }
          },
          tooltips: {
            mode: "index",
            intersect: false
          },
          plugins: {
            colorschemes: {
              scheme: "brewer.PastelOne3"
            },
            crosshair: {
              line: {
                color: "#F66", // crosshair line color
                width: 1 // crosshair line width
              },
              sync: {
                enabled: true, // enable trace line syncing with other charts
                group: 1, // chart group
                suppressTooltips: false // suppress tooltips when showing a synced tracer
              },
              zoom: {
                enabled: true, // enable zooming
                zoomboxBackgroundColor: "rgba(66,133,244,0.2)", // background color of zoom box
                zoomboxBorderColor: "#48F", // border color of zoom box
                zoomButtonText: "Reset Zoom", // reset zoom button text
                zoomButtonClass: "reset-zoom" // reset zoom button class
              },
              callbacks: {
                beforeZoom: function(start, end) {
                  // called before zoom, return false to prevent zoom
                  return true;
                },
                afterZoom: function(start, end) {
                  // called after zoom
                }
              }
            }
          }
        }
      }
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
    const { chartType, options } = this.state;

    const datasets = indelData.result.map((data, index) => ({
      // ...this.state.data.datasets[0],
      backgroundColor: "transparent",
      data: data.indel,
      label: data.label,
      type: chartType
    }));

    const chartOptions = _.cloneDeep(options);

    chartOptions[chartType].scales.xAxes[0].ticks.max = indelData.seq.length;

    this.setState({ data: { datasets }, options: chartOptions });
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
